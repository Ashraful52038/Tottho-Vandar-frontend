'use client';

import PostEditor from '@/components/posts/PostEditor';
import { postService } from '@/lib/api/posts';
import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import { createPost, fetchTags } from '@/store/slices/postSlice';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, message, Spin } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreatePostPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, tags: storeTags } = useAppSelector((state) => state.posts);
  const { user } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchTags());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/posts/create');
      return;
    }
    if (user && !user.verified) {
      router.push('/verify-email');
      return;
    }
  }, [user, router]);

  const handleSubmit = async (data: any, published: boolean) => {
    try {
      let imageUrl = data.featuredImage;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${imageUrl}`;
      }

      await dispatch(createPost({
        title: data.title,
        content: data.content,
        tagNames: data.tags,
        featuredImage: imageUrl,
        published,
      })).unwrap();

      message.success(published ? 'Post published successfully!' : 'Post saved as draft!');
      router.push('/feed');
    } catch (error: any) {
      message.error(error?.response?.data?.error || 'Failed to save post');
    }
  };

  if (!isMounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!storeTags || storeTags.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading tags..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostEditor
          tags={storeTags}
          isLoading={isLoading}
          mode="create"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}