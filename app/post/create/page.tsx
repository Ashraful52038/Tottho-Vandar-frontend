// app/posts/create/page.tsx
'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import { createPost } from '@/store/slices/postSlice';
import {
    ArrowLeftOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    message,
    Select,
    Space,
    Spin,
    Upload
} from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';

// Rich Text Editor (dynamic import for SSR)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const { TextArea } = Input;
const { Option } = Select;

// Available tags/topics
const AVAILABLE_TAGS = [
  'Programming', 'Technology', 'AI', 'Web Development',
  'Mobile Development', 'Cloud Computing', 'DevOps', 'Cybersecurity',
  'Data Science', 'Machine Learning', 'UI/UX', 'Startup',
  'Blockchain', 'Career', 'Tutorial', 'News'
];

// Quill modules configuration
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

export default function CreatePostPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.posts);
  const { user } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    router.push('/login?redirect=/posts/create');
    return null;
  }

  // Redirect if email not verified
  if (!user.verified) {
    router.push('/verify-email/sent');
    return null;
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // Mock upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);
      setFeaturedImage(imageUrl);
      message.success('Image uploaded successfully!');
    } catch (error) {
      message.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!content) {
      message.warning('Please write some content');
      return;
    }

    if (!values.tags || values.tags.length === 0) {
      message.warning('Please add at least one tag');
      return;
    }

    try {
      await dispatch(createPost({
        title: values.title,
        content: content,
        tags: values.tags,
        featuredImage: featuredImage || undefined,
        status: values.status || 'published'
      })).unwrap();

      router.push('/feed');
    } catch (error) {
      // Error is already handled in slice
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/feed" className="text-gray-600 hover:text-gray-900">
                <ArrowLeftOutlined className="text-xl" />
              </Link>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Write a Story
              </h1>
            </div>
            <Space>
              <Button 
                onClick={() => form.setFieldValue('status', 'draft')}
                disabled={isLoading}
              >
                Save Draft
              </Button>
              <Button 
                type="primary" 
                onClick={() => form.submit()}
                loading={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                Publish
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
        >
          {/* Title */}
          <Form.Item
            name="title"
            rules={[
              { required: true, message: 'Please enter a title' },
              { min: 10, message: 'Title must be at least 10 characters' }
            ]}
          >
            <Input
              size="large"
              placeholder="Title"
              className="text-4xl font-serif border-0 border-b rounded-none px-0 focus:shadow-none"
              bordered={false}
            />
          </Form.Item>

          {/* Featured Image */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Featured Image</h3>
            <Upload
              name="image"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={handleImageUpload}
              customRequest={({ onSuccess }) => {
                setTimeout(() => onSuccess?.('ok'), 0);
              }}
            >
              {featuredImage ? (
                <img src={featuredImage} alt="featured" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
            {uploading && <Spin className="ml-4" />}
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Content</h3>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Write your story here..."
              className="min-h-100"
            />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Tags</h3>
            <Form.Item
              name="tags"
              rules={[
                { required: true, message: 'Please select at least one tag' }
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select tags for your post"
                optionLabelProp="label"
                className="w-full"
              >
                {AVAILABLE_TAGS.map(tag => (
                  <Option key={tag} value={tag} label={tag}>
                    <div className="flex items-center">
                      <span className="text-gray-700">{tag}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <p className="text-sm text-gray-500 mt-2">
              Add up to 5 tags to help readers find your story
            </p>
          </div>

          {/* Hidden status field */}
          <Form.Item name="status" hidden>
            <Input />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}