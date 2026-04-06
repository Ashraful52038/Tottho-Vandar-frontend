'use client';

import { FEATURED_AUTHORS } from '@/utils/featuredAuthors';
import { BookOutlined, FireOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Tag } from '@/types/tags';

interface FeedSidebarProps {
  tags: Tag[];
  selectedTagIds: string[];
  onTagToggle: (tagId: string) => void;
  user: any;
}

export default function FeedSidebar({ tags, selectedTagIds, onTagToggle, user }: FeedSidebarProps) {
  const router = useRouter();

  return (
    <div className="hidden lg:block lg:col-span-4">
      <div className="card-bg rounded-lg shadow-sm p-5 lg:p-6 mb-6 transition-colors duration-300">
        <h2 className="text-base lg:text-lg font-semibold heading-color mb-3 lg:mb-4 flex items-center gap-2">
          <FireOutlined className="text-green-600 dark:text-green-400" />
          Recommended topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 12).map((tag: Tag) => (
            <button
              key={tag.id}
              onClick={() => onTagToggle(tag.id)}
              className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-colors
                ${selectedTagIds.includes(tag.id)
                  ? 'bg-green-600 text-white dark:bg-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card-bg rounded-lg shadow-sm p-5 lg:p-6 mb-6 transition-colors duration-300">
        <h2 className="text-base lg:text-lg font-semibold heading-color mb-3 lg:mb-4 flex items-center gap-2">
          <UserOutlined className="text-blue-600 dark:text-blue-400" />
          Featured writers
        </h2>
        <div className="space-y-3 lg:space-y-4">
          {FEATURED_AUTHORS.map(author => (
            <div key={author.id} className="flex items-start gap-2 lg:gap-3">
              <Avatar size={40} icon={<UserOutlined />} className="shrink-0 border-2 border-custom" />
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${author.id}`} className="font-medium heading-color hover:text-green-600 dark:hover:text-green-400 transition-colors block truncate text-sm lg:text-base">
                  {author.name}
                </Link>
                <p className="text-xs lg:text-sm text-secondary truncate">{author.role}</p>
                <p className="text-xs text-tertiary mt-0.5 lg:mt-1">{author.followers} followers</p>
              </div>
              <Button
                type="link"
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-0 shrink-0 text-xs lg:text-sm"
                onClick={() => {
                  if (!user) {
                    message.warning('Please login to follow authors');
                    router.push('/login');
                  }
                }}
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {user && (
        <div className="card-bg rounded-lg shadow-sm p-5 lg:p-6 transition-colors duration-300">
          <h2 className="text-base lg:text-lg font-semibold heading-color mb-3 lg:mb-4 flex items-center gap-2">
            <BookOutlined className="text-purple-600 dark:text-purple-400" />
            Your reading list
          </h2>
          <p className="text-secondary text-xs lg:text-sm mb-3 lg:mb-4">
            Save stories to read later or keep for reference.
          </p>
          <Button type="primary" block className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-sm">
            View all saved
          </Button>
        </div>
      )}
    </div>
  );
}
