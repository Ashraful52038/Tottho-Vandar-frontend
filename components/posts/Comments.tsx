'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import { addComment, likeComment, unlikeComment } from '@/store/slices/commentSlice';
import {
    HeartFilled,
    HeartOutlined,
    SendOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Form, Input, message, Space } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { TextArea } = Input;

// Comment টাইপ ডিফাইন করুন
interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  postId: string;
  parentId?: string;
  replies?: Comment[];
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CommentsProps {
  postId: string;
  comments: Comment[];
}

export default function Comments({ postId, comments }: CommentsProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyForm] = Form.useForm();

  const handleAddComment = async (values: { content: string }) => {
    if (!user) {
      message.warning('Please login to comment');
      router.push('/login');
      return;
    }

    try {
      await dispatch(addComment({
        content: values.content,
        postId,
      })).unwrap();
      form.resetFields();
      message.success('Comment added successfully!');
    } catch (error) {
      message.error('Failed to add comment');
    }
  };

  const handleAddReply = async (values: { content: string }, parentId: string) => {
    if (!user) {
      message.warning('Please login to reply');
      router.push('/login');
      return;
    }

    try {
      await dispatch(addComment({
        content: values.content,
        postId,
        parentId,
      })).unwrap();
      replyForm.resetFields();
      setReplyingTo(null);
      message.success('Reply added successfully!');
    } catch (error) {
      message.error('Failed to add reply');
    }
  };

  const handleLike = async (commentId: string, isLiked: boolean) => {
    if (!user) {
      message.warning('Please login to like comments');
      router.push('/login');
      return;
    }

    try {
      if (isLiked) {
        await dispatch(unlikeComment(commentId)).unwrap();
      } else {
        await dispatch(likeComment(commentId)).unwrap();
      }
    } catch (error) {
      message.error('Failed to like comment');
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const [isLiked, setIsLiked] = useState(comment.isLiked || false);
    const [likes, setLikes] = useState(comment.likes);

    const handleLikeClick = async () => {
      await handleLike(comment.id, isLiked);
      setIsLiked(!isLiked);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
      <div className={`${isReply ? 'ml-12 mt-4' : 'mb-6'}`}>
        <div className="flex gap-3">
          <Avatar src={comment.author.avatar} icon={<UserOutlined />} />
          
          <div className="flex-1">
            <div className="card-bg rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Link href={`/profile/${comment.author.id}`} className="font-medium heading-color hover:text-green-600">
                    {comment.author.name}
                  </Link>
                  <span className="text-xs text-tertiary ml-2">
                    {moment(comment.createdAt).fromNow()}
                  </span>
                </div>
                
                <Button
                  type="text"
                  icon={isLiked ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                  onClick={handleLikeClick}
                  size="small"
                >
                  {likes}
                </Button>
              </div>
              
              <p className="paragraph-color whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
            
            {!isReply && (
              <Button
                type="link"
                className="text-green-600 hover:text-green-700 px-0 mt-2"
                onClick={() => setReplyingTo(comment.id)}
              >
                Reply
              </Button>
            )}
          </div>
        </div>

        {/* Replies */}
        {comment.replies?.map(reply => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="ml-12 mt-4">
            <Form
              form={replyForm}
              onFinish={(values) => handleAddReply(values, comment.id)}
              className="flex gap-3"
            >
              <Avatar src={user?.avatar} icon={<UserOutlined />} size="small" />
              <div className="flex-1">
                <Form.Item
                  name="content"
                  rules={[
                    { required: true, message: 'Please enter your reply' },
                    { min: 2, message: 'Reply must be at least 2 characters' }
                  ]}
                  className="mb-2"
                >
                  <TextArea
                    placeholder="Write your reply..."
                    autoSize={{ minRows: 2, maxRows: 6 }}
                  />
                </Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SendOutlined />}
                    size="small"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Post Reply
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-serif font-bold heading-color mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <div className="mb-8">
        <Form
          form={form}
          onFinish={handleAddComment}
          className="flex gap-3"
        >
          <Avatar src={user?.avatar} icon={<UserOutlined />} />
          <div className="flex-1">
            <Form.Item
              name="content"
              rules={[
                { required: true, message: 'Please enter your comment' },
                { min: 2, message: 'Comment must be at least 2 characters' }
              ]}
              className="mb-2"
            >
              <TextArea
                placeholder={user ? "Write a comment..." : "Login to comment"}
                autoSize={{ minRows: 2, maxRows: 6 }}
                disabled={!user}
              />
            </Form.Item>
            {user && (
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                className="bg-green-600 hover:bg-green-700"
              >
                Post Comment
              </Button>
            )}
          </div>
        </Form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        
        {comments.length === 0 && (
          <p className="text-center paragraph-color py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}