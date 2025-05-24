import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Search, Bell, Plus, Home, User, Compass, Bookmark, MapPin, TrendingUp, Sparkles, Globe, Users, Calendar, Image, Smile, Send, ChevronRight, Filter, Zap } from 'lucide-react';

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
  },
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    base: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  borderRadius: {
    sm: '0.5rem',
    base: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px'
  },
  shadows: {
    sm: 'shadow-sm',
    base: 'shadow-lg shadow-gray-200/20',
    lg: 'shadow-xl shadow-gray-200/30',
    colored: 'shadow-lg shadow-blue-200/50',
    glow: 'shadow-2xl shadow-blue-300/40'
  }
};

const SocialApp = () => {
  const [activeFilter, setActiveFilter] = useState('Nearby');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [expandedPost, setExpandedPost] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        <div 
          className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-gray-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Search */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-10 h-10 bg-gradient-to-r ${designSystem.gradients.brand} rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50`}>
                    <span className="text-white font-extrabold text-base">LC</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    LocalConnect
                  </h1>
                  <p className="text-xs text-gray-500 font-medium -mt-1">Community First</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/30 shadow-sm ml-6 w-80">
                <Search className="w-4 h-4 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Discover communities, people, events..." 
                  className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 flex-1 font-medium"
                />
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 border border-gray-200 rounded text-xs font-mono text-gray-500 bg-gray-50">⌘K</kbd>
              </div>
            </div>
            
            {/* Right Navigation */}
            <div className="flex items-center space-x-3">
              <button className="relative p-2.5 hover:bg-white/60 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
              <button 
                onClick={() => setShowNewPost(!showNewPost)}
                className={`bg-gradient-to-r ${designSystem.gradients.primary} hover:from-blue-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-blue-200/50 hover:shadow-blue-300/60 hover:scale-105 font-medium`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </button>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                  alt="Profile" 
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-200/50 hover:ring-blue-300/70 transition-all duration-200 cursor-pointer hover:scale-105"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Profile Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/30 shadow-lg shadow-gray-200/20">
                <div className="flex items-center space-x-3 mb-5">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" 
                    alt="Profile" 
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">Vikram Singh</h3>
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
              <div className="space-y-1">
                {[
                  { icon: Home, label: 'Feed', active: true, badge: '12' },
                  { icon: Compass, label: 'Explore', badge: '5' },
                  { icon: Users, label: 'Communities', badge: '2' },
                  { icon: Calendar, label: 'Events', badge: '8' },
                  { icon: Bookmark, label: 'Saved' },
                  { icon: User, label: 'Profile' }
                ].map(({ icon: Icon, label, active, badge }) => (
                  <button 
                    key={label}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                      active 
                        ? `bg-gradient-to-r ${designSystem.gradients.primary} text-white shadow-lg shadow-blue-600/30` 
                        : 'text-gray-700 hover:bg-white/70 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{label}</span>
                    </div>
                    {badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl">
            {/* Filter Bar */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 mb-6 border border-white/30 shadow-lg shadow-gray-200/20">
              <div className="flex flex-wrap gap-2">
                {filters.map(({ name, icon: Icon, count }) => (
                  <button
                    key={name}
                    onClick={() => setActiveFilter(name)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      activeFilter === name
                        ? `bg-gradient-to-r ${designSystem.gradients.primary} text-white shadow-lg shadow-blue-600/30 scale-105`
                        : 'text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:shadow-sm hover:scale-102'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeFilter === name ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Create Post */}
            {showNewPost && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 mb-6 border border-white/30 shadow-lg shadow-gray-200/20">
                <div className="flex space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" 
                    alt="Your avatar" 
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="What's happening in your community?"
                      className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 resize-none text-base leading-relaxed"
                      rows="3"
                    />
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                          <Image className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                          <Smile className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                          <MapPin className="w-4 h-4" />
                        </button>
                      </div>
                      <button className={`bg-gradient-to-r ${designSystem.gradients.primary} text-white px-5 py-2 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all duration-200 font-medium text-sm`}>
                        <Send className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => {
                const typeConfig = getTypeConfig(post.type);
                return (
                  <article 
                    key={post.id} 
                    className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 overflow-hidden hover:shadow-xl hover:shadow-gray-300/30 transition-all duration-300 group hover:scale-[1.01] hover:bg-white/95"
                  >
                    {/* Post Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <img 
                              src={post.user.avatar} 
                              alt={post.user.name}
                              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-md"
                            />
                            {post.user.verified && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-base truncate">{post.user.name}</h3>
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${typeConfig.bg} ${typeConfig.text} flex items-center space-x-1 shrink-0`}>
                                <span>{typeConfig.icon}</span>
                                <span>{post.user.level}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
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
                        
                        <div className="flex items-center space-x-2">
                          <div className={`px-3 py-1.5 rounded-xl font-bold text-xs ${typeConfig.bg} ${typeConfig.text} border border-white/50 flex items-center space-x-1`}>
                            <span>{typeConfig.icon}</span>
                            <span>{post.type}</span>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-5">
                        <p className="text-gray-800 leading-relaxed text-base font-medium mb-3">{post.content}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer hover:underline transition-colors">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Post Images */}
                      {post.images && (
                        <div className={`rounded-xl overflow-hidden mb-5 ${post.images.length > 1 ? 'grid grid-cols-2 gap-2' : ''}`}>
                          {post.images.map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt="Post content" 
                              className="w-full h-60 object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                            />
                          ))}
                        </div>
                      )}

                      {/* Event Details */}
                      {post.type === 'Event' && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-5 border border-blue-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="font-semibold text-blue-900 text-sm">{post.eventDate}</p>
                                <p className="text-sm text-blue-600">{post.eventLocation}</p>
                              </div>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors">
                              Join Event
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                        <div className="flex items-center space-x-6">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-2 transition-all duration-200 hover:scale-110 ${
                              likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart 
                              className={`w-5 h-5 transition-all duration-200 ${
                                likedPosts.has(post.id) ? 'fill-red-500 text-red-500 scale-110' : ''
                              }`} 
                            />
                            <span className="font-bold text-base">
                              {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                            </span>
                          </button>
                          
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-all duration-200 hover:scale-110">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-bold text-base">{post.comments}</span>
                          </button>
                          
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-all duration-200 hover:scale-110">
                            <Share2 className="w-5 h-5" />
                            <span className="font-bold text-base">{post.shares}</span>
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${post.engagement > 90 ? 'bg-green-500' : post.engagement > 75 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-medium text-gray-600">{post.engagement}% engagement</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors">
                            <span>View details</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Trending Communities */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg shadow-gray-200/20">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg text-gray-900">Trending Communities</h3>
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Mumbai Food Lovers', members: '12.3K', growth: '+15%', avatar: '🍛' },
                    { name: 'Delhi Tech Hub', members: '8.7K', growth: '+22%', avatar: '💻' },
                    { name: 'Bangalore Startups', members: '15.2K', growth: '+8%', avatar: '🚀' },
                    { name: 'Chennai Artists', members: '5.4K', growth: '+31%', avatar: '🎨' }
                  ].map((community, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50/80 rounded-xl transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-lg">
                          {community.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{community.name}</p>
                          <p className="text-xs text-gray-500">{community.members} members</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {community.growth}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors">
                  Explore All Communities
                </button>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg shadow-gray-200/20">
                <h3 className="font-bold text-lg text-gray-900 mb-5">Upcoming Events</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Tech Meetup 2024', date: 'Dec 16', time: '6:00 PM', location: 'Cyber Hub, Gurgaon', attendees: 124 },
                    { title: 'Art Gallery Opening', date: 'Dec 18', time: '7:30 PM', location: 'MG Road, Bangalore', attendees: 89 },
                    { title: 'Food Festival', date: 'Dec 20', time: '12:00 PM', location: 'Connaught Place, Delhi', attendees: 256 }
                  ].map((event, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">{event.title}</h4>
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
                          <Users className="w-3 h-3" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                      <button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg text-xs font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200">
                        Join Event
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg shadow-gray-200/20">
                <h3 className="font-bold text-lg text-gray-900 mb-5">Your Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Posts this month</span>
                    <span className="font-bold text-blue-600">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Communities joined</span>
                    <span className="font-bold text-purple-600">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Events attended</span>
                    <span className="font-bold text-green-600">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Impact score</span>
                    <span className="font-bold text-orange-600">847</span>
                  </div>
                </div>
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">Level 5</p>
                    <p className="text-sm text-gray-500 mb-3">Community Explorer</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{width: '73%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">267/400 XP to next level</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialApp;