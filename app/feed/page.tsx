'use client';

import FeedSidebar from '@/components/feed/FeedSidebar';
import FeedTabsContent from '@/components/feed/FeedTabs';
import Navbar from '@/components/layout/Navbar';
import PostCard, { normalizePost } from '@/components/posts/PostCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import { fetchPosts, fetchTags } from '@/store/slices/postSlice';
import { Tag as TagType } from '@/types/tags';
import {
  CloseOutlined,
  ReloadOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Button, Empty, Select, Space, Spin, Tag, message } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Option } = Select;

export default function FeedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { posts: storePosts, isLoading, error, tags } = useAppSelector((state) => state.posts);
  const { user } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const posts = storePosts || [];

  // Load tags
  useEffect(() => {
    if (isMounted) {
      dispatch(fetchTags());
    }
  }, [dispatch, isMounted]);

  // First time load URL params
  useEffect(() => {
    if (!isInitialized && isMounted) {
      const search = searchParams.get('search') || '';
      const tags = searchParams.get('tag')?.split(',').filter(Boolean) || [];
      setSearchQuery(search);
      setSelectedTagIds(tags);
      setIsInitialized(true);
    }
  }, [searchParams, isMounted, isInitialized]);

  // Sync state with URL changes
  useEffect(() => {
    if (isInitialized) {
      const search = searchParams.get('search') || '';
      const tags = searchParams.get('tag')?.split(',').filter(Boolean) || [];
      if (search !== searchQuery) setSearchQuery(search);
      if (JSON.stringify(tags) !== JSON.stringify(selectedTagIds)) setSelectedTagIds(tags);
    }
  }, [searchParams, isInitialized]);

  // Fetch feed posts (for you tab)
  useEffect(() => {
    if (isMounted && isInitialized) {
      loadPosts();
    }
  }, [dispatch, retryCount, selectedTagIds, searchQuery, isMounted, isInitialized]);

  const loadPosts = async () => {
    try {
      const tagIdsParam = selectedTagIds.length ? selectedTagIds.join(',') : undefined;
      await dispatch(fetchPosts({
        page: 1,
        limit: 10,
        tagIds: tagIdsParam,
        search: searchQuery || undefined,
        sortBy: 'latest'
      })).unwrap();
    } catch (err) {
      message.error('Failed to load posts. Please try again.');
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const updateURL = (search: string, tags: string[]) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (tags.length) params.set('tag', tags.join(','));
    const newUrl = `/feed?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateURL(query, selectedTagIds);
  };

  const toggleTag = (tagId: string) => {
    const newTags = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    setSelectedTagIds(newTags);
    updateURL(searchQuery, newTags);
  };

  const clearAllFilters = () => {
    setSelectedTagIds([]);
    setSearchQuery('');
    updateURL('', []);
  };

  const handleWritePost = () => {
    if (!user) {
      message.warning('Please login to write a post');
      router.push('/login?redirect=/posts/create');
    } else if (!user.verified) {
      message.warning('Please verify your email before posting');
      router.push('/verify-email');
    } else {
      router.push('/posts/create');
    }
  };

  const handleLogin = () => {
    router.push('/login?redirect=/feed');
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isLoading && posts.length === 0 && !isInitialized) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar onSearch={handleSearch} searchQuery={searchQuery} onTopicSelect={() => {}} selectedTopic="" />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-secondary">Loading your feed...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navbar
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onTopicSelect={() => {}}
        selectedTopic=""
        tags={tags}
        onTagSelect={toggleTag}
        selectedTagIds={selectedTagIds}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold heading-color mb-2 sm:mb-3 lg:mb-4 px-4">
            {user ? `Welcome back, ${user.name}!` : 'Welcome to Tottho Vandar'}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl paragraph-color max-w-2xl mx-auto px-4">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 px-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <WarningOutlined className="text-red-600 dark:text-red-400 text-lg sm:text-xl" />
                <p className="text-red-700 dark:text-red-400 text-sm sm:text-base">{error}</p>
              </div>
              <Button onClick={handleRetry} icon={<ReloadOutlined />} size="small" className="w-full sm:w-auto">
                Retry
              </Button>
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8 px-4">
          <div className="card-bg rounded-lg shadow-sm p-3 sm:p-4 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <Select
                mode="multiple"
                placeholder="Filter by topic"
                style={{ width: '100%', maxWidth: '300px' }}
                value={selectedTagIds}
                onChange={(values) => {
                  const newTags = values as string[];
                  setSelectedTagIds(newTags);
                  updateURL(searchQuery, newTags);
                }}
                allowClear
                maxTagCount="responsive"
                popupClassName="dark:bg-gray-800"
                className="dark:text-white w-full sm:w-auto"
              >
                {tags.map((tag: TagType) => (
                  <Option key={tag.id} value={tag.id} className="dark:text-white">
                    {tag.name}
                  </Option>
                ))}
              </Select>

              {(selectedTagIds.length > 0 || searchQuery) && (
                <Space size={4} wrap>
                  {selectedTagIds.map(id => {
                    const tag = tags.find((t: TagType) => t.id === id);
                    return tag ? (
                      <Tag
                        key={id}
                        closable
                        onClose={() => toggleTag(id)}
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        {tag.name}
                      </Tag>
                    ) : null;
                  })}
                  {searchQuery && (
                    <Tag closable onClose={() => setSearchQuery('')} className="bg-blue-100 text-blue-800">
                      Search: {searchQuery}
                    </Tag>
                  )}
                  <Button type="link" size="small" onClick={clearAllFilters} icon={<CloseOutlined />}>
                    Clear all
                  </Button>
                </Space>
              )}

              <div className="flex gap-2 w-full sm:w-auto justify-start">
                <Button type="text" className="text-secondary hover:text-primary flex-1 sm:flex-none" size="middle">
                  Following
                </Button>
                <Button type="text" className="text-secondary hover:text-primary flex-1 sm:flex-none" size="middle">
                  Saved
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4">
          <div className="lg:col-span-8">
            <FeedTabsContent
              posts={posts}
              user={user}
              isMobile={isMobile}
              onLogin={handleLogin}
              onWritePost={handleWritePost}
              hasSearchFilters={searchQuery !== '' || selectedTagIds.length > 0}
            />
          </div>

          {/* Right sidebar */}
          <FeedSidebar
            tags={tags}
            selectedTagIds={selectedTagIds}
            onTagToggle={toggleTag}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}