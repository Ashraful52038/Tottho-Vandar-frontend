'use client';

import axiosInstance from '@/lib/api/axios';
import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import { fetchTags } from '@/store/slices/postSlice';
import { Tag as TagType } from '@/types/tags';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Tag } from 'antd';
import { useEffect, useState } from 'react';

const { Search } = Input;

export default function TagManager() {
  const dispatch = useAppDispatch();
  const { tags, isLoading } = useAppSelector((state) => state.posts);
  const { user } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const filteredTags = tags.filter((tag: TagType )=>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTag = async (values: { name: string }) => {
    try {
      const response = await axiosInstance.post('/tags', values);
      message.success('Tag created successfully');
      dispatch(fetchTags());
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to create tag');
    }
  };

  const handleUpdateTag = async (values: { name: string }) => {
    if (!editingTag) return;

    try {
      await axiosInstance.put(`/tags/${editingTag.id}`, values);
      message.success('Tag updated successfully');
      dispatch(fetchTags());
      setIsModalOpen(false);
      setEditingTag(null);
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update tag');
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    Modal.confirm({
      title: 'Delete Tag',
      content: 'Are you sure you want to delete this tag? Posts with this tag will be affected.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axiosInstance.delete(`/tags/${tagId}`);
          message.success('Tag deleted successfully');
          dispatch(fetchTags());
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Failed to delete tag');
        }
      },
    });
  };

  const openCreateModal = () => {
    setEditingTag(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (tag: TagType) => {
    setEditingTag(tag);
    form.setFieldsValue({ name: tag.name });
    setIsModalOpen(true);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-4 text-center">
        <p>You don't have permission to manage tags.</p>
      </div>
    );
  }

  return (
    <div className="card-bg rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-bold heading-color">Manage Tags</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="bg-green-600 hover:bg-green-700"
        >
          New Tag
        </Button>
      </div>

      <Search
        placeholder="Search tags..."
        allowClear
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      <div className="space-y-2">
        {filteredTags.map((tag:TagType) => (
          <div
            key={tag.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Tag color="green" className="text-base px-3 py-1">
                {tag.name}
              </Tag>
              {tag.count !== undefined && (
                <span className="text-sm text-tertiary">
                  {tag.count} {tag.count === 1 ? 'post' : 'posts'}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => openEditModal(tag)}
              />
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={() => handleDeleteTag(tag.id)}
              />
            </div>
          </div>
        ))}

        {filteredTags.length === 0 && (
          <p className="text-center paragraph-color py-8">
            {searchTerm ? 'No tags found matching your search' : 'No tags available'}
          </p>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={editingTag ? 'Edit Tag' : 'Create New Tag'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTag(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingTag ? handleUpdateTag : handleCreateTag}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tag Name"
            rules={[
              { required: true, message: 'Please enter tag name' },
              { min: 2, message: 'Tag name must be at least 2 characters' },
              { max: 30, message: 'Tag name must be less than 30 characters' },
              {
                pattern: /^[a-zA-Z0-9-]+$/,
                message: 'Tag name can only contain letters, numbers, and hyphens'
              }
            ]}
          >
            <Input placeholder="e.g., react, javascript, tutorial" />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Button onClick={() => {
              setIsModalOpen(false);
              setEditingTag(null);
              form.resetFields();
            }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {editingTag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}