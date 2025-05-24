import React, { useState, useEffect } from 'react';
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


const SocialApp = () => {
  const [activeFilter, setActiveFilter] = useState('Nearby');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filters = [
    { name: 'Nearby', icon: MapPin, count: '2.3K' },
    { name: 'New', icon: Sparkles, count: '845' },
    { name: 'Trending', icon: TrendingUp, count: '1.2K' },
    { name: 'Top', icon: Zap, count: '956' }
  ];

  const posts = [
    {
      id: 1,
      user: {
        name: 'Priya Sharma',
        username: 'priya_dev',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true,
        level: 'Community Leader'
      },
      content: 'Just discovered this hidden gem café in Bandra! The masala chai here is absolutely divine ☕️ They also have amazing workspace vibes for remote work. Anyone else been here?',
      images: [
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&h=300&fit=crop'
      ],
      type: 'Discovery',
      state: 'Maharashtra',
      city: 'Mumbai',
      time: '2h',
      likes: 124,
      comments: 28,
      shares: 12,
      engagement: 95,
      tags: ['#MumbaiCafes', '#RemoteWork', '#HiddenGems']
    },
    {
      id: 2,
      user: {
        name: 'Rahul Kumar',
        username: 'rahul_tech',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false,
        level: 'Rising Star'
      },
      content: 'Organizing a massive tech meetup this weekend! 🚀 We have speakers from Google, Microsoft, and some amazing startups. Topics include AI, Web3, and career growth. Limited spots available!',
      type: 'Event',
      state: 'Haryana',
      city: 'Gurgaon',
      time: '4h',
      likes: 256,
      comments: 43,
      shares: 28,
      engagement: 87,
      eventDate: 'Sat, Dec 16',
      eventLocation: 'Cyber Hub',
      tags: ['#TechMeetup', '#AI', '#Networking']
    },
    {
      id: 3,
      user: {
        name: 'Ananya Patel',
        username: 'ananya_art',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        verified: true,
        level: 'Creative Master'
      },
      content: 'Spent the weekend creating this digital mandala inspired by traditional Gujarati art forms. Each pattern tells a story of our rich cultural heritage. What stories do you see in the patterns?',
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop'],
      type: 'Creative',
      state: 'Gujarat',
      city: 'Ahmedabad',
      time: '6h',
      likes: 189,
      comments: 35,
      shares: 15,
      engagement: 92,
      tags: ['#DigitalArt', '#GujaratiCulture', '#Mandala']
    },
    {
      id: 4,
      user: {
        name: 'Vikram Singh',
        username: 'vikram_fit',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: false,
        level: 'Fitness Enthusiast'
      },
      content: 'Morning run through India Gate was incredible today! The weather is perfect and the energy is contagious. Planning a group run tomorrow at 6 AM. Who\'s joining the #DelhiRunners crew?',
      images: ['https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&h=300&fit=crop'],
      type: 'Activity',
      state: 'Delhi',
      city: 'New Delhi',
      time: '8h',
      likes: 98,
      comments: 22,
      shares: 8,
      engagement: 78,
      tags: ['#MorningRun', '#DelhiRunners', '#Fitness']
    }
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
      <NavigationBar setShowNewPost={setShowNewPost} setMobileMenuOpen={setMobileMenuOpen} showNewPost={showNewPost} mobileMenuOpen={mobileMenuOpen}/>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu setMobileMenuOpen={setMobileMenuOpen}/>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Hidden on mobile */}
         <LeftSideBar/>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl">
            {/* Filter Bar - Mobile Version (unchanged) */}
            <FilterBarMobile filters={filters} setActiveFilter={setActiveFilter} activeFilter={activeFilter} />

            {/* Filter Bar - Desktop Version (fixed) */}
            <FilterBar setActiveFilter={setActiveFilter} activeFilter={activeFilter} filters={filters}/>

            {/* Create Post */}
            {showNewPost && (
              <CreatePost setNewPostContent={setNewPostContent}/>
            )}

            {/* Posts Feed */}
            <PostFeed getTypeConfig={getTypeConfig} posts={posts} handleLike={handleLike} likedPosts={likedPosts}/>
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          <RightSide/>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation/>
    </div>
  );
};

export default SocialApp;