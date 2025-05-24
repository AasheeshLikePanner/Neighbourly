import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Search, Bell, Plus, Home, User, Compass, Bookmark, MapPin, TrendingUp, Sparkles, Users as UsersIcon, Calendar, Image as ImageIcon, Smile, Send, ChevronRight, Filter, Zap, X } from 'lucide-react';

// Design System - Colors & Gradients
const designSystem = {
  colors: {
    primary: {
      blue: '#2563eb',
      cyan: '#06b6d4',
      purple: '#7c3aed',
      indigo: '#4f46e5'
    },
    secondary: {
      amber: '#f59e0b',
      orange: '#ea580c',
      green: '#059669',
      emerald: '#10b981',
      pink: '#ec4899',
      red: '#dc2626'
    },
    neutral: {
      gray50: '#f9fafb',
      gray100: '#f3f4f6',
      gray200: '#e5e7eb',
      gray300: '#d1d5db',
      gray400: '#9ca3af',
      gray500: '#6b7280',
      gray600: '#4b5563',
      gray700: '#374151',
      gray800: '#1f2937',
      gray900: '#111827'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  gradients: {
    primary: 'from-blue-600 to-cyan-600',
    secondary: 'from-purple-600 to-pink-600',
    accent: 'from-amber-500 to-orange-500',
    success: 'from-green-500 to-emerald-500',
    background: 'from-slate-50 via-blue-50/30 to-indigo-50/20',
    glass: 'from-white/70 to-white/50',
    brand: 'from-blue-600 via-purple-600 to-cyan-600'
  }
};

const SocialApp = () => {
  const [activeFilter, setActiveFilter] = useState('Nearby');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Feed');

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
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LC</span>
            </div>
            <h1 className="font-bold text-gray-900">LocalConnect</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Profile */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" 
                alt="Profile" 
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">Vikram Singh</h3>
                <p className="text-sm text-gray-500">Level 5 Explorer</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="space-y-1">
              {[
                { icon: Home, label: 'Feed', active: activeTab === 'Feed' },
                { icon: Compass, label: 'Explore', active: activeTab === 'Explore' },
                { icon: UsersIcon, label: 'Communities', active: activeTab === 'Communities' },
                { icon: Calendar, label: 'Events', active: activeTab === 'Events' },
                { icon: Bookmark, label: 'Saved', active: activeTab === 'Saved' },
                { icon: User, label: 'Profile', active: activeTab === 'Profile' }
              ].map(({ icon: Icon, label, active }) => (
                <button 
                  key={label}
                  onClick={() => {
                    setActiveTab(label);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left ${
                    active 
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
            
            {/* Create Post Button */}
            <button 
              onClick={() => {
                setShowNewPost(true);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Post</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto lg:px-6">
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-6 space-y-6 p-4">
              {/* Profile Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-5">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" 
                    alt="Profile" 
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">Vikram Singh</h3>
                    <p className="text-sm text-gray-500">Level 5 Explorer</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-gray-900">127</p>
                    <p className="text-xs text-gray-500 font-medium">Posts</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-blue-600">2.3K</p>
                    <p className="text-xs text-gray-500 font-medium">Followers</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-purple-600">845</p>
                    <p className="text-xs text-gray-500 font-medium">Following</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation Menu */}
              <nav className="space-y-1">
                {[
                  { icon: Home, label: 'Feed', active: activeTab === 'Feed', badge: '12' },
                  { icon: Compass, label: 'Explore', active: activeTab === 'Explore', badge: '5' },
                  { icon: UsersIcon, label: 'Communities', active: activeTab === 'Communities', badge: '2' },
                  { icon: Calendar, label: 'Events', active: activeTab === 'Events', badge: '8' },
                  { icon: Bookmark, label: 'Saved', active: activeTab === 'Saved' },
                  { icon: User, label: 'Profile', active: activeTab === 'Profile' }
                ].map(({ icon: Icon, label, active, badge }) => (
                  <button 
                    key={label}
                    onClick={() => setActiveTab(label)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left ${
                      active 
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </div>
                    {badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              
              {/* Create Post Button */}
              <button 
                onClick={() => setShowNewPost(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Post</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 lg:max-w-2xl lg:px-4">
            {/* Create Post (Mobile) */}
            {showNewPost && (
              <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">Create Post</h2>
                  <button 
                    onClick={() => setShowNewPost(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" 
                    alt="Your avatar" 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="What's happening in your community?"
                      className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 resize-none text-base leading-relaxed"
                      rows="3"
                    />
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                          <ImageIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                          <Smile className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                          <MapPin className="w-5 h-5" />
                        </button>
                      </div>
                      <button 
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-cyan-700 transition-all font-medium text-sm"
                        disabled={!newPostContent.trim()}
                      >
                        <Send className="w-4 h-4" />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <div className="sticky top-0 lg:top-6 z-10 bg-white/90 backdrop-blur-xl p-2 mb-4 border-b lg:border lg:rounded-xl lg:shadow-sm border-gray-200">
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map(({ name, icon: Icon, count }) => (
                  <button
                    key={name}
                    onClick={() => setActiveFilter(name)}
                    className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm ${
                      activeFilter === name
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      activeFilter === name ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4 pb-20 lg:pb-4">
              {posts.map((post) => {
                const typeConfig = getTypeConfig(post.type);
                return (
                  <article 
                    key={post.id} 
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Post Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <img 
                              src={post.user.avatar} 
                              alt={post.user.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            {post.user.verified && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-white">
                                <span className="text-white text-[10px]">✓</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-sm truncate">{post.user.name}</h3>
                              <span className={`px-2 py-1 rounded-md text-xs font-medium ${typeConfig.bg} ${typeConfig.text} flex items-center space-x-1`}>
                                <span>{typeConfig.icon}</span>
                                <span className="hidden sm:inline">{post.user.level}</span>
                              </span>
                            </div>
                            <div className="flex items-center flex-wrap gap-x-2 text-xs text-gray-500">
                              <span className="font-medium">@{post.user.username}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{post.city}, {post.state}</span>
                              </div>
                              <span>•</span>
                              <span>{post.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <div className={`px-2 py-1 rounded-md font-medium text-xs ${typeConfig.bg} ${typeConfig.text} flex items-center space-x-1`}>
                            <span>{typeConfig.icon}</span>
                            <span className="hidden sm:inline">{post.type}</span>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-gray-800 leading-relaxed text-sm sm:text-base mb-3">{post.content}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm cursor-pointer hover:underline">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Post Images */}
                      {post.images && (
                        <div className={`rounded-lg overflow-hidden mb-4 ${post.images.length > 1 ? 'grid grid-cols-2 gap-2' : ''}`}>
                          {post.images.map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt="Post content" 
                              className="w-full h-40 sm:h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                            />
                          ))}
                        </div>
                      )}

                      {/* Event Details */}
                      {post.type === 'Event' && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 mb-4 border border-blue-100">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="font-semibold text-blue-900 text-sm">{post.eventDate}</p>
                                <p className="text-xs text-blue-600">{post.eventLocation}</p>
                              </div>
                            </div>
                            <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium text-xs hover:bg-blue-700 transition-colors">
                              Join Event
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4 sm:space-x-6">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-1 ${
                              likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart 
                              className={`w-5 h-5 ${
                                likedPosts.has(post.id) ? 'fill-red-500' : ''
                              }`} 
                            />
                            <span className="font-medium text-sm">
                              {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                            </span>
                          </button>
                          
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium text-sm">{post.comments}</span>
                          </button>
                          
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
                            <Share2 className="w-5 h-5" />
                            <span className="font-medium text-sm">{post.shares}</span>
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            post.engagement > 90 ? 'bg-green-500' : post.engagement > 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="text-xs text-gray-500 hidden sm:inline">{post.engagement}% engagement</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </main>

          {/* Right Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-6 space-y-6 p-4">
              {/* Trending Communities */}
              <div className="bg-white/90 backdrop-blur-xl rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Trending Communities</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Mumbai Food Lovers', members: '12.3K', growth: '+15%', avatar: '🍛' },
                    { name: 'Delhi Tech Hub', members: '8.7K', growth: '+22%', avatar: '💻' },
                    { name: 'Bangalore Startups', members: '15.2K', growth: '+8%', avatar: '🚀' },
                    { name: 'Chennai Artists', members: '5.4K', growth: '+31%', avatar: '🎨' }
                  ].map((community, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-lg">
                          {community.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{community.name}</p>
                          <p className="text-xs text-gray-500">{community.members} members</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {community.growth}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors">
                  Explore All
                </button>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white/90 backdrop-blur-xl rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Tech Meetup 2024', date: 'Dec 16', time: '6:00 PM', location: 'Cyber Hub, Gurgaon', attendees: 124 },
                    { title: 'Art Gallery Opening', date: 'Dec 18', time: '7:30 PM', location: 'MG Road, Bangalore', attendees: 89 },
                    { title: 'Food Festival', date: 'Dec 20', time: '12:00 PM', location: 'Connaught Place, Delhi', attendees: 256 }
                  ].map((event, index) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <h4 className="font-medium text-gray-900 text-sm mb-2">{event.title}</h4>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <UsersIcon className="w-3 h-3" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                      <button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-1.5 rounded-lg text-xs font-medium hover:from-blue-700 hover:to-cyan-700 transition-all">
                        Join Event
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center">
          {[
            { icon: Home, label: 'Feed' },
            { icon: Compass, label: 'Explore' },
            { icon: Plus, label: 'Create' },
            { icon: UsersIcon, label: 'Communities' },
            { icon: User, label: 'Profile' }
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => {
                if (label === 'Create') {
                  setShowNewPost(true);
                } else {
                  setActiveTab(label);
                }
              }}
              className={`flex flex-col items-center justify-center py-3 px-4 w-full ${
                activeTab === label ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default SocialApp;