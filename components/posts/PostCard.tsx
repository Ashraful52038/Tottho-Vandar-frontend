'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import { likePost } from '@/store/slices/postSlice';
import { Post } from '@/types/user';
import {
  ClockCircleOutlined,
  CommentOutlined,
  HeartFilled,
  HeartOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Card, Space, Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Title, Text, Paragraph } = Typography;

interface PostCardProps {
  post: Post;
  onPostClick?: (id: string) => void;
}

// Helper function to normalize post data (handle different data structures)
const normalizePost = (post: any) => {
  return {
    ...post,
    // Ensure author exists
    author: post.author || {
      id: post.authorId || 'unknown',
      name: 'Unknown Author',
      avatar: null
    },
    // Ensure tags array
    tags: post.tags || [],
    // Ensure counts
    likesCount: post.likesCount || post.likes || 0,
    commentsCount: post.commentsCount || post.comments || 0,
    // Ensure timestamps
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || post.createdAt || new Date().toISOString()
  };
};

export default function PostCard({ post: originalPost, onPostClick }: PostCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [liked, setLiked] = useState(false);
  
  // Normalize the post data to handle different structures
  const post = normalizePost(originalPost);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      await dispatch(likePost(post.id)).unwrap();
      setLiked(!liked);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleClick = () => {
    if (onPostClick) {
      onPostClick(post.id);
    } else {
      router.push(`/posts/${post.id}`);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/posts/${post.id}#comments`);
  };

  return (
    <Card 
      hoverable 
      className="mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 card-bg border-custom"
      onClick={handleClick}
      cover={post.featuredImage && (
        <div className="h-48 overflow-hidden rounded-t-lg">
          <img 
            alt={post.title} 
            src={post.featuredImage}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Handle image load error
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      styles={{ body: { padding: '20px' } }}
    >
      {/* Author Info */}
      <div className="flex items-center mb-3">
        <Avatar 
          icon={<UserOutlined />} 
          src={post.author?.avatar}
          size={40}
          className="border border-custom"
        />
        <div className="ml-3">
          <Text strong className="heading-color hover:text-green-600 dark:hover:text-green-400 transition-colors">
            {post.author?.name || 'Unknown Author'}
          </Text>
          <div className="flex items-center text-xs text-secondary">
            <Tooltip title={moment(post.createdAt).format('LLLL')}>
              <ClockCircleOutlined className="mr-1" />
              <span>{moment(post.createdAt).fromNow()}</span>
            </Tooltip>
            {post.readingTime && (
              <>
                <span className="mx-2">·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Post Title */}
      <Title level={4} className="mb-2 heading-color hover:text-green-600 dark:hover:text-green-400 transition-colors line-clamp-2">
        {post.title}
      </Title>
      
      {/* Post Excerpt */}
      <Paragraph 
        ellipsis={{ rows: 3, expandable: false }} 
        className="paragraph-color mb-3"
      >
        {post.excerpt || post.content}
      </Paragraph>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag: string) => (
            <Tag 
              key={tag} 
              color="blue" 
              className="mr-1 px-2 py-1 text-xs dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              {tag}
            </Tag>
          ))}
          {post.tags.length > 3 && (
            <Tag className="px-2 py-1 text-xs dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
              +{post.tags.length - 3}
            </Tag>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-custom">
        <Space size="middle">
          <Button 
            type="text" 
            icon={liked ? 
              <HeartFilled className="text-red-500 dark:text-red-400 text-lg" /> : 
              <HeartOutlined className="text-secondary text-lg" />
            }
            onClick={handleLike}
            className="flex items-center text-secondary hover:text-red-500 dark:hover:text-red-400"
          >
            <span className="ml-1">{post.likesCount}</span>
          </Button>
          
          <Button 
            type="text" 
            icon={<CommentOutlined className="text-secondary text-lg" />}
            onClick={handleCommentClick}
            className="flex items-center text-secondary hover:text-blue-500 dark:hover:text-blue-400"
          >
            <span className="ml-1">{post.commentsCount}</span>
          </Button>
        </Space>

        <Button 
          type="link" 
          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-0"
          onClick={handleClick}
        >
          Read more
        </Button>
      </div>
    </Card>
  );
}