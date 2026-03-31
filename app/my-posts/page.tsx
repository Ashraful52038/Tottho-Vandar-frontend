'use client';

import PostCard from '@/components/posts/PostCard';
import { userService } from '@/lib/api/user';
import { useAppSelector } from '@/store/hooks/reduxHooks';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Spin, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyPostsPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Redirect if not logged in
  if (!user) {
    router.push('/login');
    return null;
  }

  const fetchPosts = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await userService.getUserPosts(user.id, pageNum, 10);
      const newPosts = response.posts || [];
      setPosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
      setTotal(response.total || 0);
      setHasMore((pageNum * 10) < (response.total || 0));
      setPage(pageNum);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts(1);
    }
  }, [user]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back button */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="flex items-center gap-1 text-white! hover:text-white!"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Posts</h1>
        </div>

        {/* Posts List */}
        {loading && page === 1 ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} loading={loading}>
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-500">You haven't created any posts yet.</p>
            <Button
              type="primary"
              href="/posts/create"
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              Create Your First Post
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}