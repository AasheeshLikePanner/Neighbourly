import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Settings, Mail, Calendar, Link, MapPin, 
  Heart, MessageCircle, Bookmark, ChevronDown, MoreHorizontal 
} from 'lucide-react';
import designSystem from '../utils/designSystem';
import { getUserProfile, getUserPosts } from '../apis/user.api';
import PostCard from './PostCard'; // Assume we have a PostCard component
import Loader from './Loader';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useStore();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const [userData, userPosts] = await Promise.all([
          getUserProfile(username),
          getUserPosts(username)
        ]);
        
        setProfileUser(userData);
        setPosts(userPosts);
        
        if (currentUser && currentUser.following.includes(userData._id)) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/not-found');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [username, currentUser, navigate]);

  const handleFollow = async () => {
    // Implement follow/unfollow logic
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return <Loader />;
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
      <div className="px-4 md:px-6 relative">
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
            
            <div className="mb-2">
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
          <div className="flex space-x-6 mb-6">
            <div className="flex items-center space-x-1">
              <span 
                className="font-bold"
                style={{ color: designSystem.colors.neutral.gray800 }}
              >
                {profileUser.postCount || 0}
              </span>
              <span style={{ color: designSystem.colors.neutral.gray500 }}>Posts</span>
            </div>
            <div className="flex items-center space-x-1">
              <span 
                className="font-bold"
                style={{ color: designSystem.colors.neutral.gray800 }}
              >
                {profileUser.followersCount || 0}
              </span>
              <span style={{ color: designSystem.colors.neutral.gray500 }}>Followers</span>
            </div>
            <div className="flex items-center space-x-1">
              <span 
                className="font-bold"
                style={{ color: designSystem.colors.neutral.gray800 }}
              >
                {profileUser.followingCount || 0}
              </span>
              <span style={{ color: designSystem.colors.neutral.gray500 }}>Following</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-6">
            {profileUser.location && (
              <div className="flex items-center space-x-2">
                <MapPin 
                  className="w-4 h-4" 
                  style={{ color: designSystem.colors.neutral.gray500 }} 
                />
                <span style={{ color: designSystem.colors.neutral.gray700 }}>
                  {profileUser.location}
                </span>
              </div>
            )}
            {profileUser.website && (
              <div className="flex items-center space-x-2">
                <Link 
                  className="w-4 h-4" 
                  style={{ color: designSystem.colors.neutral.gray500 }} 
                />
                <a 
                  href={profileUser.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: designSystem.colors.primary.blue }}
                  className="hover:underline"
                >
                  {profileUser.website.replace(/(^\w+:|^)\/\//, '')}
                </a>
              </div>
            )}
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
      <div className="mt-4 px-4 md:px-6">
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map(post => (
                <PostCard key={post._id} post={post} />
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;