// app/posts/edit/[id]/page.tsx
'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import { fetchPostById, updatePost } from '@/store/slices/postSlice';
import {
    ArrowLeftOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {
    Alert,
    Button,
    Form,
    Input,
    message,
    Select,
    Spin,
    Upload
} from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const { Option } = Select;

const AVAILABLE_TAGS = [
  'Programming', 'Technology', 'AI', 'Web Development',
  'Mobile Development', 'Cloud Computing', 'DevOps', 'Cybersecurity',
  'Data Science', 'Machine Learning', 'UI/UX', 'Startup'
];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentPost, isLoading } = useAppSelector((state) => state.posts);
  const { user } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchPostById(params.id as string));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (currentPost) {
      form.setFieldsValue({
        title: currentPost.title,
        tags: currentPost.tags
      });
      setContent(currentPost.content);
      setFeaturedImage(currentPost.featuredImage || '');
    }
  }, [currentPost, form]);

  // Check if user is author
  useEffect(() => {
    if (currentPost && user && currentPost.authorId !== user.id) {
      message.error('You are not authorized to edit this post');
      router.push(`/posts/${params.id}`);
    }
  }, [currentPost, user, params.id, router]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);
      setFeaturedImage(imageUrl);
      message.success('Image updated successfully!');
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

    try {
      await dispatch(updatePost({
        id: params.id as string,
        data: {
          title: values.title,
          content: content,
          tags: values.tags,
          featuredImage: featuredImage || undefined
        }
      })).unwrap();

      message.success('Post updated successfully!');
      router.push(`/posts/${params.id}`);
    } catch (error) {
      // Error handled in slice
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert message="Post not found" type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/posts/${params.id}`} className="text-gray-600 hover:text-gray-900">
                <ArrowLeftOutlined className="text-xl" />
              </Link>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Edit Story
              </h1>
            </div>
            <Button 
              type="primary" 
              onClick={() => form.submit()}
              loading={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              Update
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
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
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input
              size="large"
              placeholder="Title"
              className="text-4xl font-serif border-0 border-b rounded-none px-0"
              bordered={false}
            />
          </Form.Item>

          {/* Featured Image */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Featured Image</h3>
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={handleImageUpload}
              customRequest={({ onSuccess }) => {
                setTimeout(() => onSuccess?.('ok'), 0);
              }}
            >
              {featuredImage ? (
                <img src={featuredImage} alt="featured" style={{ width: '100%' }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {uploading && <Spin className="ml-4" />}
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Content</h3>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="min-h-100"
            />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Tags</h3>
            <Form.Item name="tags">
              <Select
                mode="multiple"
                placeholder="Select tags"
                className="w-full"
              >
                {AVAILABLE_TAGS.map(tag => (
                  <Option key={tag} value={tag}>{tag}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}