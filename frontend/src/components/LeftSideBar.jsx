import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Search, Bell, Plus, Home, User, Compass, Bookmark, MapPin, TrendingUp, Sparkles, Globe, Users, Calendar, Image, Smile, Send, ChevronRight, Filter, Zap, Menu } from 'lucide-react';
import designSystem from '../utils/designSystem';

const LeftSideBar = ({ user, currentView, setView }) => {
    const menuItems = [
        { icon: Home, label: 'Feed', view: 'home', badge: '12' },
        { icon: Compass, label: 'Explore', view: 'explore', badge: '5' },
        { icon: Users, label: 'Communities', view: 'communities', badge: '2' },
        { icon: Calendar, label: 'Events', view: 'events', badge: '8' },
        { icon: Bookmark, label: 'Saved', view: 'saved' },
        { icon: User, label: 'Profile', view: 'profile' }
    ];
    
    return (
        <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
                {/* Profile Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/30 shadow-lg shadow-gray-200/20">
                    <div className="flex items-center space-x-3 mb-5">
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-11 h-11 rounded-xl object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900 text-base">{user.fullName}</h3>
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
                    {menuItems.map(({ icon: Icon, label, view: itemView, badge }) => (
                        <button
                            key={label}
                            onClick={() => setView(itemView)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                                currentView === itemView
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
                                    currentView === itemView 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-red-500 text-white'
                                }`}>
                                    {badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeftSideBar;