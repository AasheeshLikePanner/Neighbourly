import { useEffect, useState } from 'react';
import PostFeed from './PostFeed';


export default function ProfileBar({ user, profileData, profilePosts, getTypeConfig, handleLike, likedPosts, isLoading, handleViewDetails }) {
  const [posts, setPosts] = useState(profilePosts || [])
  function addUserToPosts() {
    if (!profilePosts) {
      console.error("profilePosts is not an array or is undefined");
      return;
    }
    const postsWithOwner = profilePosts.map(post => ({
      ...post,
      owner: user // Replace owner with the full user data
    }));
    setPosts(postsWithOwner);
    console.log("Posts after adding user:", postsWithOwner);
  }
  useEffect(() => { addUserToPosts() }, [profilePosts])

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg shadow-gray-200/20">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={profileData?.avatar || user.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-md"
          />
          <h1 className="text-2xl font-bold text-gray-900">{profileData?.fullName || user.fullName}</h1>
          <p className="text-gray-600 mb-2">Level 5 Explorer</p>
          <p className="text-gray-700 max-w-md">
            {profileData?.bio || 'Adventure seeker, nature lover, and photography enthusiast.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-4">
          <div>
            <p className="text-xl font-bold text-gray-900">{profilePosts.length}</p>
            <p className="text-sm text-gray-500 font-medium">Posts</p>
          </div>
          <div>
            <p className="text-xl font-bold text-blue-600">2.3K</p>
            <p className="text-sm text-gray-500 font-medium">Followers</p>
          </div>
          <div>
            <p className="text-xl font-bold text-purple-600">845</p>
            <p className="text-sm text-gray-500 font-medium">Following</p>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 px-2">Recent Activity</h2>
        <PostFeed
          getTypeConfig={getTypeConfig}
          posts={posts}
          handleLike={handleLike}
          likedPosts={likedPosts}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
}