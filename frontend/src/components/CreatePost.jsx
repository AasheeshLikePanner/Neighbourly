import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Search, Bell, Plus, Home, User, Compass, Bookmark, MapPin, TrendingUp, Sparkles, Globe, Users, Calendar, Image, Smile, Send, ChevronRight, Filter, Zap, Menu } from 'lucide-react';
import designSystem from '../utils/designSystem'

const CreatePost = ({setNewPostContent, newPostContent} ) => {

    return (
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
    )
}

export default CreatePost;