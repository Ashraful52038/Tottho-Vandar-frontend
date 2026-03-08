'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import { deletePost, fetchPostById, likePost } from '@/store/slices/postSlice';
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Button,
  Modal,
  Space,
  Spin,
  Tag,
  message
} from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentPost, isLoading, error } = useAppSelector((state) => state.posts);
  const { user } = useAppSelector((state) => state.auth);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchPostById(params.id as string));
    }
  }, [dispatch, params.id]);

  const handleLike = async (e?: React.MouseEvent) => {
      if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      router.push('/login');
      return;
    }

    try {
      await dispatch(likePost(params.id as string)).unwrap();
    } catch (error) {
      message.error('Failed to like post');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deletePost(params.id as string)).unwrap();
      message.success('Post deleted successfully');
      router.push('/feed');
    } catch (error) {
      message.error('Failed to delete post');
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleEdit = () => {
    router.push(`/posts/edit/${params.id}`);
  };

  // Helper function to extract tag names
  const getTagNames = (tags: any[]): string[] => {
    if (!tags || !Array.isArray(tags)) return [];
    
    return tags.map(tag => {
      if (typeof tag === 'string') return tag;
      if (tag && typeof tag === 'object') {
        if (tag.name) return tag.name;
        if (tag.slug) return tag.slug;
        if (tag.id) return String(tag.id);
      }
      return '';
    }).filter(tag => tag !== '');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert
          message="Error"
          description={error || 'Post not found'}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const isAuthor = user?.id === currentPost.authorId;
  const tagNames = getTagNames(currentPost.tags || []);

  const likesCount = currentPost?.likesCount || currentPost?.likes || 0;


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/feed" className="text-gray-600 hover:text-gray-900">
              <ArrowLeftOutlined className="text-xl" />
            </Link>
            <Space>
              <Button
                icon={(likesCount > 0) ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                onClick={handleLike}
              >
                {likesCount}
              </Button>
              <Button icon={<CommentOutlined />}>
                {currentPost.commentsCount || 0}
              </Button>
              {isAuthor && (
                <>
                  <Button icon={<EditOutlined />} onClick={handleEdit}>
                    Edit
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Space>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm p-8">
          {/* Author Info */}
          <div className="flex items-center mb-6">
            <Avatar 
              size={64} 
              icon={<UserOutlined />} 
              src={currentPost.author?.avatar}
              className="border-2 border-gray-200"
            />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentPost.author?.name || 'Unknown Author'}
              </h2>
              <div className="flex items-center text-gray-500 mt-1">
                <ClockCircleOutlined className="mr-1" />
                <span>{moment(currentPost.createdAt).format('MMMM D, YYYY')}</span>
                <span className="mx-2">·</span>
                <span>{currentPost.readingTime || 5} min read</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            {currentPost.title}
          </h1>

          {/* Tags */}
          {tagNames.length > 0 && (
            <div className="mb-6">
              {tagNames.map((tagName) => (
                <Link key={tagName} href={`/feed?tag=${tagName}`}>
                  <Tag color="blue" className="mr-2 px-3 py-1 text-sm cursor-pointer hover:opacity-80">
                    {tagName}
                  </Tag>
                </Link>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {currentPost.featuredImage && (
            <div className="mb-8">
              <img 
                src={currentPost.featuredImage} 
                alt={currentPost.title}
                className="w-full rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <ReactQuill
              value={currentPost.content}
              readOnly={true}
              theme="bubble"
            />
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-serif font-semibold mb-4">
            Comments ({currentPost.commentsCount || 0})
          </h3>
          <p className="text-gray-500 text-center py-8">
            Comments section coming soon...
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Post"
        open={deleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this post?</p>
        <p className="text-red-500">This action cannot be undone!</p>
      </Modal>
    </div>
  );
}