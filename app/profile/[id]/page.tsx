'use client';

import FollowersList from '@/components/profile/FollowersList';
import FollowingList from '@/components/profile/FollowingList';
import UserComments from '@/components/profile/UserComments';
import UserLikes from '@/components/profile/UserLikes';
import UserPosts from '@/components/profile/UserPosts';
import type { FollowUser } from '@/lib/api/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import {
  fetchFollowers,
  fetchFollowing,
  fetchProfile,
  fetchUserComments,
  fetchUserLikes,
  fetchUserPosts,
  followUser,
  resetComments,
  resetPosts,
  unfollowUser
} from '@/store/slices/profileSlice';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  EditOutlined,
  LoadingOutlined,
  MailOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row, Spin, Statistic, Tabs, message } from 'antd';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { 
    profile, 
    posts, 
    comments, 
    likes, 
    followers, 
    following,
    isLoading,
    totalPosts,
    totalComments,
    totalLikes,
    totalFollowers,
    totalFollowing,
    currentPage 
  } = useAppSelector((state) => state.profile);
  
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const profileId = params?.id as string;
  const isOwnProfile = currentUser?.id ? String(currentUser.id) === profileId : false;

  useEffect(() => {
    if (profileId) {
      dispatch(fetchProfile(profileId));
      dispatch(fetchUserPosts({ userId: profileId, page: 1 }));
      dispatch(fetchUserComments({ userId: profileId, page: 1 }));
      dispatch(fetchUserLikes({ userId: profileId, page: 1 }));
      dispatch(fetchFollowers({ userId: profileId, page: 1 }));
      dispatch(fetchFollowing({ userId: profileId, page: 1 }));
    }

    return () => {
      dispatch(resetPosts());
      dispatch(resetComments());
    };
  }, [dispatch, profileId]);

  useEffect(() => {
    if (currentUser && !isOwnProfile && followers.length > 0) {
      const isFollow = followers.some((follower: FollowUser) => follower.id === currentUser.id);
      setIsFollowing(isFollow);
    }
  }, [followers, currentUser, isOwnProfile]);

  const handleFollow = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    try {
      if (isFollowing) {
        await dispatch(unfollowUser(profileId)).unwrap();
        setIsFollowing(false);
        message.success('Unfollowed successfully');
      } else {
        await dispatch(followUser(profileId)).unwrap();
        setIsFollowing(true);
        message.success('Followed successfully');
      }
    } catch (error) {
      message.error('Failed to update follow status');
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const loadMorePosts = () => {
    if (posts.length < totalPosts) {
      dispatch(fetchUserPosts({ userId: profileId, page: currentPage.posts }));
    }
  };

  const loadMoreComments = () => {
    if (comments.length < totalComments) {
      dispatch(fetchUserComments({ userId: profileId, page: currentPage.comments }));
    }
  };

  const loadMoreLikes = () => {
    if (likes.length < totalLikes) {
      dispatch(fetchUserLikes({ userId: profileId, page: currentPage.likes }));
    }
  };

  const loadMoreFollowers = () => {
    if (followers.length < totalFollowers) {
      dispatch(fetchFollowers({ userId: profileId, page: currentPage.followers }));
    }
  };

  const loadMoreFollowing = () => {
    if (following.length < totalFollowing) {
      dispatch(fetchFollowing({ userId: profileId, page: currentPage.following }));
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist.</p>
          <Button type="primary" href="/feed" className="bg-green-600 hover:bg-green-700">
            Go to Feed
          </Button>
        </Card>
      </div>
    );
  }

  const items = [
    {
      key: 'posts',
      label: `My Posts (${totalPosts})`,
      children: (
        <UserPosts 
          posts={posts} 
          userId={profileId} 
          isOwnProfile={isOwnProfile}
          onLoadMore={loadMorePosts}
          hasMore={posts.length < totalPosts}
        />
      ),
    },
    {
      key: 'comments',
      label: `Comments (${totalComments})`,
      children: (
        <UserComments 
          comments={comments} 
          onLoadMore={loadMoreComments}
          hasMore={comments.length < totalComments}
        />
      ),
    },
    {
      key: 'likes',
      label: `Likes (${totalLikes})`,
      children: (
        <UserLikes 
          likes={likes} 
          onLoadMore={loadMoreLikes}
          hasMore={likes.length < totalLikes}
        />
      ),
    },
    {
      key: 'followers',
      label: `Followers (${totalFollowers})`,
      children: (
        <FollowersList 
          followers={followers} 
          currentUserId={currentUser?.id}
          onLoadMore={loadMoreFollowers}
          hasMore={followers.length < totalFollowers}
        />
      ),
    },
    {
      key: 'following',
      label: `Following (${totalFollowing})`,
      children: (
        <FollowingList 
          following={following} 
          currentUserId={currentUser?.id}
          onLoadMore={loadMoreFollowing}
          hasMore={following.length < totalFollowing}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <Card className="mb-10 shadow-md">
          {/* Back button (left side) */}
          <div className="flex justify-between items-start mb-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
            >
              Back
            </Button>
            {/* Right side button: Edit Profile or Follow */}
            <div>
              {isOwnProfile ? (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEditProfile}>
                  Edit Profile
                </Button>
              ) : (
                <Button type={isFollowing ? 'default' : 'primary'} onClick={handleFollow}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar size={100} src={profile.avatar} icon={<UserOutlined />} />
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {profile.name}
                    {profile.verified && <CheckCircleFilled style={{ color: '#0284c7', fontSize: 20 }} />}
                  </h1>
                  <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-700">
                    <div className="flex items-center gap-2">
                      <MailOutlined />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarOutlined />
                      <span>Joined {moment(profile.createdAt).format('MMMM YYYY')}</span>
                    </div>
                  </div>
                  {profile.bio && <p className="mt-3 text-gray-700 dark:text-gray-1000">{profile.bio}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-6 pt-4 border-t">
            <Row gutter={16}>
              <Col span={6}><Statistic title="My Posts" value={totalPosts} /></Col>
              <Col span={6}><Statistic title="Followers" value={totalFollowers} /></Col>
              <Col span={6}><Statistic title="Following" value={totalFollowing} /></Col>
              <Col span={6}><Statistic title="Likes" value={totalLikes} /></Col>
            </Row>
          </div>
        </Card>

        <div className="h-3"></div>

        {/* Tabs Card */}
        <Card className="shadow-md">
          <Tabs items={items} activeKey={activeTab} onChange={setActiveTab} />
        </Card>
      </div>
    </div>
  );
}