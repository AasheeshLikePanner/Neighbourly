import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Settings, Mail, Calendar, Link, MapPin,
  Heart, MessageCircle, Bookmark, ChevronDown, MoreHorizontal
} from 'lucide-react';
import designSystem from '../utils/designSystem';
import { getUserPosts } from '../apis/post.api';
import { getUserProfile } from '../apis/apis';
import useStore from '../store/store';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useStore();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    level: 1
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user profile and posts
        const userData = await getUserProfile(username);
        const userPosts = await getUserPosts(username);

        if (!userData || userData.length === 0) {
          throw new Error('User not found');
        }

        setProfileUser(userData[0]);
        setPosts(userPosts);

        // Calculate stats
        const totalLikes = userPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
        const totalComments = userPosts.reduce((sum, post) => sum + (post.comment?.length || 0), 0);

        // Simple level calculation
        const engagementScore = totalLikes + (totalComments * 2) + (userPosts.length * 3);
        const level = Math.min(Math.floor(engagementScore / 100) + 1, 10);

        setStats({
          totalPosts: userPosts.length,
          totalLikes,
          totalComments,
          level
        });

      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/not-found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, navigate]);

  const handleFollow = async () => {
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: designSystem.colors.primary.blue }}></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ color: designSystem.colors.neutral.gray800 }}>
            Profile not found
          </h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 rounded-full font-medium"
            style={{
              backgroundColor: designSystem.colors.primary.blue,
              color: 'white'
            }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isCurrentUser = currentUser?._id === profileUser._id;

  return (
    <div className="pb-20" style={{ backgroundColor: designSystem.colors.neutral.gray50 }}>
      {/* Cover Photo */}
      <div
        className="h-40 md:h-60 w-full bg-gradient-to-r"
        style={{
          background: `linear-gradient(135deg, ${designSystem.colors.primary.blue}, ${designSystem.colors.primary.cyan})`,
          borderRadius: `0 0 ${designSystem.borderRadius.xl} ${designSystem.borderRadius.xl}`
        }}
      ></div>

      {/* Profile Header */}
      <div className="px-4 md:px-6 relative max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
          {/* Avatar and Basic Info */}
          <div className="flex items-end space-x-4">
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 overflow-hidden"
              style={{
                backgroundColor: designSystem.colors.neutral.gray200,
                borderColor: 'white',
                borderRadius: designSystem.borderRadius.full
              }}
            >
              {profileUser.avatar ? (
                <img
                  src={profileUser.avatar}
                  alt={profileUser.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User
                  className="w-full h-full p-6 text-gray-400"
                  style={{ color: designSystem.colors.neutral.gray400 }}
                />
              )}
            </div>

            <div className="mb-2 mt-20">
              <h1
                className="font-bold text-xl md:text-2xl"
                style={{ color: designSystem.colors.neutral.gray800 }}
              >
                {profileUser.fullName}
              </h1>
              <p
                className="text-sm md:text-base"
                style={{ color: designSystem.colors.neutral.gray500 }}
              >
                @{profileUser.username}
              </p>

              {/* Level Badge */}
              <div className="mt-1 flex items-center">
                <div
                  className="px-2 py-1 text-xs font-bold rounded-full"
                  style={{
                    backgroundColor: designSystem.colors.primary.blue100,
                    color: designSystem.colors.primary.blue,
                    borderRadius: designSystem.borderRadius.full
                  }}
                >
                  Level {stats.level}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 md:mt-0 flex space-x-3">
            {isCurrentUser ? (
              <button
                className="px-4 py-2 rounded-full font-medium flex items-center space-x-2"
                style={{
                  backgroundColor: designSystem.colors.neutral.gray200,
                  color: designSystem.colors.neutral.gray800,
                  borderRadius: designSystem.borderRadius.full
                }}
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  className="px-4 py-2 rounded-full font-medium"
                  style={{
                    backgroundColor: designSystem.colors.neutral.gray200,
                    color: designSystem.colors.neutral.gray800,
                    borderRadius: designSystem.borderRadius.full
                  }}
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  className="px-4 py-2 rounded-full font-medium text-white"
                  onClick={handleFollow}
                  style={{
                    backgroundColor: isFollowing ? designSystem.colors.neutral.gray800 : designSystem.colors.primary.blue,
                    borderRadius: designSystem.borderRadius.full
                  }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bio and Stats */}
        <div className="mt-6">
          <p
            className="text-sm md:text-base mb-4"
            style={{ color: designSystem.colors.neutral.gray700 }}
          >
            {profileUser.bio || (isCurrentUser ? 'Add a bio to your profile' : 'No bio yet')}
          </p>

          {/* User Stats */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-1 bg-gray-100 px-3 py-2 rounded-lg">
              <span
                className="font-bold"
                style={{ color: designSystem.colors.neutral.gray800 }}
              >
                {stats.totalPosts}
              </span>
              <span style={{ color: designSystem.colors.neutral.gray500 }}>Posts</span>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 px-3 py-2 rounded-lg">
              <span
                className="font-bold"
                style={{ color: designSystem.colors.neutral.gray800 }}
              >
                {stats.totalLikes}
              </span>
              <span style={{ color: designSystem.colors.neutral.gray500 }}>Likes</span>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 px-3 py-2 rounded-lg">
              <span
                className="font-bold"
                style={{ color: designSystem.colors.neutral.gray800 }}
              >
                {stats.totalComments}
              </span>
              <span style={{ color: designSystem.colors.neutral.gray500 }}>Comments</span>
            </div>
          </div>

          {/* Additional Info */}
          {profileUser.city && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-6">
              <div className="flex items-center space-x-2">
                <MapPin
                  className="w-4 h-4"
                  style={{ color: designSystem.colors.neutral.gray500 }}
                />
                <span style={{ color: designSystem.colors.neutral.gray700 }}>
                  {profileUser.city}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar
                  className="w-4 h-4"
                  style={{ color: designSystem.colors.neutral.gray500 }}
                />
                <span style={{ color: designSystem.colors.neutral.gray700 }}>
                  Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b" style={{ borderColor: designSystem.colors.neutral.gray200 }}>
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-3 px-1 font-medium relative ${activeTab === 'posts' ? 'text-blue-600' : 'text-gray-500'}`}
              style={{
                color: activeTab === 'posts' ? designSystem.colors.primary.blue : designSystem.colors.neutral.gray500
              }}
            >
              Posts
              {activeTab === 'posts' && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                  style={{ backgroundColor: designSystem.colors.primary.blue }}
                ></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`pb-3 px-1 font-medium relative ${activeTab === 'likes' ? 'text-blue-600' : 'text-gray-500'}`}
              style={{
                color: activeTab === 'likes' ? designSystem.colors.primary.blue : designSystem.colors.neutral.gray500
              }}
            >
              Likes
              {activeTab === 'likes' && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                  style={{ backgroundColor: designSystem.colors.primary.blue }}
                ></div>
              )}
            </button>
            {isCurrentUser && (
              <button
                onClick={() => setActiveTab('saved')}
                className={`pb-3 px-1 font-medium relative ${activeTab === 'saved' ? 'text-blue-600' : 'text-gray-500'}`}
                style={{
                  color: activeTab === 'saved' ? designSystem.colors.primary.blue : designSystem.colors.neutral.gray500
                }}
              >
                Saved
                {activeTab === 'saved' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                    style={{ backgroundColor: designSystem.colors.primary.blue }}
                  ></div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 px-4 md:px-6 max-w-4xl mx-auto">
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map(post => (
                <div
                  key={post._id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    borderRadius: designSystem.borderRadius.lg,
                    border: `1px solid ${designSystem.colors.neutral.gray200}`
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {profileUser.avatar ? (
                        <img
                          src={profileUser.avatar}
                          alt={profileUser.username}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <p
                          className="font-bold text-sm truncate"
                          style={{ color: designSystem.colors.neutral.gray800 }}
                        >
                          {profileUser.fullName}
                        </p>
                        <p
                          className="text-sm truncate"
                          style={{ color: designSystem.colors.neutral.gray500 }}
                        >
                          @{profileUser.username}
                        </p>
                        <span
                          className="text-xs"
                          style={{ color: designSystem.colors.neutral.gray500 }}
                        >
                          · {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: designSystem.colors.neutral.gray700 }}
                      >
                        {post.content}
                      </p>
                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post content"
                          className="mt-2 rounded-lg w-full max-h-80 object-cover"
                          style={{ borderRadius: designSystem.borderRadius.md }}
                        />
                      )}
                      <div className="mt-3 flex items-center space-x-4">
                        <button className="flex items-center space-x-1">
                          <MessageCircle
                            className="w-4 h-4"
                            style={{ color: designSystem.colors.neutral.gray500 }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: designSystem.colors.neutral.gray500 }}
                          >
                            {post.comment?.length || 0}
                          </span>
                        </button>
                        <button className="flex items-center space-x-1">
                          <Heart
                            className="w-4 h-4"
                            style={{
                              color: post.likes?.includes(currentUser?._id)
                                ? designSystem.colors.primary.red
                                : designSystem.colors.neutral.gray500
                            }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: designSystem.colors.neutral.gray500 }}
                          >
                            {post.likeCount || 0}
                          </span>
                        </button>
                      </div>
                    </div>
                    <button>
                      <MoreHorizontal
                        className="w-4 h-4"
                        style={{ color: designSystem.colors.neutral.gray500 }}
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="text-center py-12"
                style={{ color: designSystem.colors.neutral.gray500 }}
              >
                <p className="text-lg font-medium mb-2">
                  {isCurrentUser ? 'You haven\'t posted anything yet' : 'No posts yet'}
                </p>
                {isCurrentUser && (
                  <button
                    onClick={() => navigate('/create')}
                    className="px-4 py-2 rounded-full font-medium text-white mt-4"
                    style={{
                      backgroundColor: designSystem.colors.primary.blue,
                      borderRadius: designSystem.borderRadius.full
                    }}
                  >
                    Create your first post
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="text-center py-12" style={{ color: designSystem.colors.neutral.gray500 }}>
            <Heart
              className="w-10 h-10 mx-auto mb-4"
              style={{ color: designSystem.colors.neutral.gray300 }}
            />
            <p className="text-lg font-medium mb-2">
              {isCurrentUser ? 'Posts you like will appear here' : 'No liked posts yet'}
            </p>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-12" style={{ color: designSystem.colors.neutral.gray500 }}>
            <Bookmark
              className="w-10 h-10 mx-auto mb-4"
              style={{ color: designSystem.colors.neutral.gray300 }}
            />
            <p className="text-lg font-medium mb-2">Saved posts will appear here</p>
            {isCurrentUser && (
              <button
                onClick={() => navigate('/explore')}
                className="px-4 py-2 rounded-full font-medium text-white mt-4"
                style={{
                  backgroundColor: designSystem.colors.primary.blue,
                  borderRadius: designSystem.borderRadius.full
                }}
              >
                Explore posts
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;