import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Search, Bell, Plus, Home, User, Compass, Bookmark, MapPin, TrendingUp, Sparkles, Globe, Users, Calendar, Image, Smile, Send, ChevronRight, Filter, Zap, Menu } from 'lucide-react';
import designSystem from '../utils/designSystem'
import NavigationBar from './NavigationBar';
import MobileMenu from './MobileMenu';
import LeftSideBar from './LeftSideBar';
import FilterBarMobile from './FilterBarMobile';
import FilterBar from './FilterBar';
import CreatePost from './CreatePost';
import PostFeed from './PostFeed';
import RightSide from './RightSide';
import MobileBottomNavigation from './MobileBottomNavigation';
import useStore from '../store/store'
import { getAllPost } from '../apis/post.api';

const SocialApp = () => {
  const [activeFilter, setActiveFilter] = useState('Nearby');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, setUser } = useStore();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function getPosts() {
      setIsLoading(true);
      try {
        const { latitude, longitude } = await getLocation();
        const response = await getAllPost({ latitude, longitude, filterType: activeFilter.toLowerCase() });
        setPosts(response.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    }
    getPosts();
  }, [activeFilter]);


  const getLocation = async () => {
    if (!navigator.geolocation) return;
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0
        });
      });

      return { latitude: position.coords.latitude, longitude: position.coords.longitude };
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  const filters = [
    { name: 'Nearby', icon: MapPin, count: '2.3K' },
    { name: 'New', icon: Sparkles, count: '845' },
    { name: 'Trending', icon: TrendingUp, count: '1.2K' },
    { name: 'Top', icon: Zap, count: '956' }
  ];


  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const getTypeConfig = (type) => {
    const configs = {
      'Discovery': {
        gradient: designSystem.gradients.accent,
        bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
        text: 'text-amber-700',
        icon: '🔍'
      },
      'Event': {
        gradient: designSystem.gradients.primary,
        bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
        text: 'text-blue-700',
        icon: '🎯'
      },
      'Creative': {
        gradient: designSystem.gradients.secondary,
        bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
        text: 'text-purple-700',
        icon: '🎨'
      },
      'Activity': {
        gradient: designSystem.gradients.success,
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        text: 'text-green-700',
        icon: '⚡'
      }
    };
    return configs[type] || configs['Discovery'];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${designSystem.gradients.background} relative overflow-hidden`}>

      {/* Navigation Bar */}
      <NavigationBar user={user} setShowNewPost={setShowNewPost} setMobileMenuOpen={setMobileMenuOpen} showNewPost={showNewPost} mobileMenuOpen={mobileMenuOpen} />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu setMobileMenuOpen={setMobileMenuOpen} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Hidden on mobile */}
          <LeftSideBar user={user} />

          {/* Main Content */}
          <div className="flex-1 max-w-2xl">
            {/* Filter Bar - Mobile Version (unchanged) */}
            <FilterBarMobile filters={filters} setActiveFilter={setActiveFilter} activeFilter={activeFilter} />

            {/* Filter Bar - Desktop Version (fixed) */}
            <FilterBar setActiveFilter={setActiveFilter} activeFilter={activeFilter} filters={filters} />

            {/* Create Post */}
            {showNewPost && (
              <CreatePost setNewPostContent={setNewPostContent} newPostContent={newPostContent} />
            )}

            {/* Posts Feed */}
            <PostFeed
              getTypeConfig={getTypeConfig}
              posts={posts}
              handleLike={handleLike}
              likedPosts={likedPosts}
              isLoading={isLoading}
            />
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          <RightSide />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />
    </div>
  );
};

export default SocialApp;