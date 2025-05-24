import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Search, Bell, Plus, Home, User, Compass, Bookmark, MapPin, TrendingUp, Sparkles, Globe, Users, Calendar, Image, Smile, Send, ChevronRight, Filter, Zap, Menu } from 'lucide-react';
import designSystem from '../utils/designSystem'

const MobileBottomNavigation = () => {

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50">
        <div className="flex justify-around py-3">
          <button className="p-2 text-blue-600">
            <Home className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-500">
            <Compass className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowNewPost(true)}
            className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-lg shadow-blue-400/50 -mt-6 w-14 h-14 flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-500">
            <Users className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-500">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    )
}
export default MobileBottomNavigation;