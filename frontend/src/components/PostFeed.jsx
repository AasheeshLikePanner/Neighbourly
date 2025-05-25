import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, ChevronRight, Calendar } from 'lucide-react';
import designSystem from '../utils/designSystem';
import POST_TYPES from '../utils/postTypes';
import  formatTwitterDate  from '../utils/dateUtils';
import { Tooltip } from './Tooltip';

const PostFeed = ({ getTypeConfig, posts = [], handleLike, likedPosts, isLoading, onViewDetails }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 p-6 animate-pulse">
            {/* Loading skeleton remains the same */}
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 p-8 text-center">
        <div className="mx-auto max-w-md">
          <Compass className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No posts to show</h3>
          <p className="text-gray-500 mb-4">
            There are currently no posts in your area. Be the first to share something!
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-md transition-all">
            Create your first post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const typeConfig = getTypeConfig(post.type);
        const currentPostType = POST_TYPES.find(type => type.value === post.type) || POST_TYPES[2];
        const isLiked = likedPosts.has(post._id);
        
        return (
          <article
            key={post._id}
            className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 overflow-hidden hover:shadow-xl hover:shadow-gray-300/30 transition-all duration-300 group hover:scale-[1.01] hover:bg-white/95"
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={post.owner.avatar}
                      alt={post.owner.username}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-base truncate">{post.owner.fullName||'unkown'}</h3>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${typeConfig.bg} ${typeConfig.text} flex items-center space-x-1 flex-shrink-0`}>
                        <span>{typeConfig.icon}</span>
                        <span className="hidden sm:inline">2</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
                      <span className="font-medium truncate">@{post.owner.username}</span>
                      <span>•</span>
                      <Tooltip content={post.city}>
                        <div className="flex items-center space-x-1 max-w-[120px] group">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate group-hover:text-blue-600 transition-colors">{post.city}</span>
                        </div>
                      </Tooltip>
                      <span>•</span>
                      <span className="whitespace-nowrap">{formatTwitterDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <div 
                    style={{
                      backgroundColor: currentPostType.bgColor,
                      color: currentPostType.color,
                      borderColor: currentPostType.borderColor,
                      fontSize: designSystem.typography.fontSize.sm,
                      fontWeight: designSystem.typography.fontWeight.medium
                    }} 
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 max-w-[150px] sm:max-w-none`}
                  >
                    <span className="flex-shrink-0">{typeConfig.icon}</span>
                    <span className="truncate hidden sm:inline">{currentPostType.label}</span>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-gray-800 leading-relaxed text-base font-medium mb-3">{post.content}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Tags would go here */}
                </div>
              </div>

              {post.image && (
                <div className={`rounded-xl overflow-hidden mb-5`}>
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-60 object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                    onClick={() => onViewDetails(post._id)}
                  />
                </div>
              )}

              {post.type === 'event' && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-5 border border-blue-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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

              <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={(e) => {
                      // e.stopPropagation();
                      handleLike(post._id);
                    }}
                    className={`flex items-center space-x-2 transition-all duration-200 hover:scale-110 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-200 ${isLiked ? 'fill-red-500 text-red-500 scale-110' : ''}`}
                    />
                    <span className="font-bold text-base">
                      {post.likeCount}
                    </span>
                  </button>

                  <button 
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-all duration-200 hover:scale-110"
                    onClick={() => onViewDetails(post._id)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-bold text-base">{post.commentCount}</span>
                  </button>

                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-all duration-200 hover:scale-110">
                    <Share2 className="w-5 h-5" />
                    <span className="font-bold text-base">{post.shares || 2}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                    onClick={() => onViewDetails(post._id)}
                  >
                    <span className="hidden sm:inline">View details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PostFeed;