import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Search, Bell, Plus, Home, User, Compass, Bookmark, MapPin, TrendingUp, Sparkles, Globe, Users, Calendar, Image, Smile, Send, ChevronRight, Filter, Zap, Menu } from 'lucide-react';
import designSystem from '../utils/designSystem'

const FilterBar = ({setActiveFilter, activeFilter, filters=[]}) => {

    return (
        <div className="hidden lg:block bg-white/80 backdrop-blur-xl rounded-2xl p-2 mb-6 border border-white/30 shadow-lg shadow-gray-200/20 overflow-x-auto">
            <div className="flex flex-nowrap gap-2">
                {filters.map(({ name, icon: Icon, count }) => (
                    <button
                        key={name}
                        onClick={() => setActiveFilter(name)}
                        className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${activeFilter === name
                            ? `bg-gradient-to-r ${designSystem.gradients.primary} text-white shadow-lg shadow-blue-600/30`
                            : 'text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:shadow-sm'
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeFilter === name ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default FilterBar;