'use client';

import PostCard from '@/components/posts/PostCard';
import type { FollowUser, UserComment, UserLike, UserPost } from '@/lib/api/user';
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
  HeartOutlined,
  LoadingOutlined,
  MailOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row, Spin, Statistic, Tabs, message } from 'antd';
import moment from 'moment';
import Link from 'next/link';
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
        {/* Profile Header Card with Back Button and Edit Button */}
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

// ----- All child components (unchanged but included for completeness) -----

interface TabProps { onLoadMore: () => void; hasMore: boolean; }
interface UserPostsProps extends TabProps { posts: UserPost[]; userId: string; isOwnProfile: boolean; }

function UserPosts({ posts, isOwnProfile, onLoadMore, hasMore }: UserPostsProps) {

  return (
    <div className="space-y-4">
      {isOwnProfile && (
        <div className="flex justify-end">
          <Button type="primary" href="/posts/create" icon={<EditOutlined />}>Create Post</Button>
        </div>
      )}
      {posts.length ? (
        <>
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
          
          {hasMore && (
          <div className="text-center mt-4">
            <Button onClick={onLoadMore}>
              Load More
            </Button>
          </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">No posts yet.</div>
      )}
    </div>
  );
}

interface UserCommentsProps extends TabProps { comments: UserComment[]; }
function UserComments({ comments, onLoadMore, hasMore }: UserCommentsProps) {
  return (
    <div className="space-y-4">
      {comments.length ? (
        <>
          {comments.map(comment => (
            <Card key={comment.id} className="cursor-pointer hover:shadow" onClick={() => window.location.href = `/posts/${comment.postId}`}>
              <p>{comment.content}</p>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>on {comment.postTitle || 'Post'}</span>
                <span><HeartOutlined /> {comment.likes || 0} • {moment(comment.createdAt).fromNow()}</span>
              </div>
            </Card>
          ))}
          {hasMore && <div className="text-center mt-4"><Button onClick={onLoadMore}>Load More</Button></div>}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">No comments yet.</div>
      )}
    </div>
  );
}

interface UserLikesProps extends TabProps { likes: UserLike[]; }
function UserLikes({ likes, onLoadMore, hasMore }: UserLikesProps) {
  return (
    <div className="space-y-4">
      {likes.length ? (
        <>
          {likes.map(like => (
            <Card key={like.id} className="cursor-pointer hover:shadow" onClick={() => window.location.href = like.postId ? `/posts/${like.postId}` : '#'}>
              {like.type === 'post' ? (
                <p><HeartOutlined className="text-red-500" /> Liked a post: <strong>{like.postTitle || 'Post'}</strong></p>
              ) : (
                <p><HeartOutlined className="text-red-500" /> Liked a comment: "{like.content}" on {like.postTitle || 'Post'}</p>
              )}
              <div className="text-right text-gray-400 text-sm mt-1">{moment(like.createdAt).fromNow()}</div>
            </Card>
          ))}
          {hasMore && <div className="text-center mt-4"><Button onClick={onLoadMore}>Load More</Button></div>}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">No likes yet.</div>
      )}
    </div>
  );
}

interface FollowersListProps extends TabProps { followers: FollowUser[]; currentUserId?: string; }
function FollowersList({ followers, currentUserId, onLoadMore, hasMore }: FollowersListProps) {
  const dispatch = useAppDispatch();
  const handleFollow = async (userId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) await dispatch(unfollowUser(userId)).unwrap();
      else await dispatch(followUser(userId)).unwrap();
      message.success(isFollowing ? 'Unfollowed' : 'Followed');
    } catch { message.error('Failed'); }
  };
  return (
    <div className="space-y-4">
      {followers.length ? (
        <>
          {followers.map(f => (
            <Card key={f.id}>
              <div className="flex items-center gap-4">
                <Avatar src={f.avatar} icon={<UserOutlined />} />
                <div className="flex-1">
                  <Link href={`/profile/${f.id}`} className="font-semibold hover:text-green-600">{f.name}</Link>
                  {f.bio && <p className="text-sm text-gray-500">{f.bio}</p>}
                </div>
                {currentUserId && currentUserId !== f.id && (
                  <Button size="small" type={f.isFollowing ? 'default' : 'primary'} onClick={() => handleFollow(f.id, f.isFollowing)}>
                    {f.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </Card>
          ))}
          {hasMore && <div className="text-center"><Button onClick={onLoadMore}>Load More</Button></div>}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">No followers yet.</div>
      )}
    </div>
  );
}

interface FollowingListProps extends TabProps { following: FollowUser[]; currentUserId?: string; }
function FollowingList({ following, currentUserId, onLoadMore, hasMore }: FollowingListProps) {
  const dispatch = useAppDispatch();
  const handleUnfollow = async (userId: string) => {
    try { await dispatch(unfollowUser(userId)).unwrap(); message.success('Unfollowed'); } catch { message.error('Failed'); }
  };
  return (
    <div className="space-y-4">
      {following.length ? (
        <>
          {following.map(f => (
            <Card key={f.id}>
              <div className="flex items-center gap-4">
                <Avatar src={f.avatar} icon={<UserOutlined />} />
                <div className="flex-1">
                  <Link href={`/profile/${f.id}`} className="font-semibold hover:text-green-600">{f.name}</Link>
                  {f.bio && <p className="text-sm text-gray-500">{f.bio}</p>}
                </div>
                {currentUserId && currentUserId !== f.id && (
                  <Button size="small" type="default" onClick={() => handleUnfollow(f.id)}>Following</Button>
                )}
              </div>
            </Card>
          ))}
          {hasMore && <div className="text-center"><Button onClick={onLoadMore}>Load More</Button></div>}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">Not following anyone yet.</div>
      )}
    </div>
  );
}