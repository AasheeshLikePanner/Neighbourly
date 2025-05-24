import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Search, Bell, Plus, Home, User, Compass, Bookmark, MapPin, TrendingUp, Sparkles, Globe, Users, Calendar, Image, Smile, Send, ChevronRight, Filter, Zap, Menu } from 'lucide-react';
import designSystem from '../utils/designSystem'

const MobileMenu = ({setMobileMenuOpen}) => {

    return (
        <div className="lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl p-6 overflow-y-auto">
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Search */}
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
                <Search className="w-4 h-4 text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 flex-1 font-medium"
                />
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-4">
                {[
                    { icon: Home, label: 'Feed', active: true },
                    { icon: Compass, label: 'Explore' },
                    { icon: Users, label: 'Communities' },
                    { icon: Calendar, label: 'Events' },
                    { icon: Bookmark, label: 'Saved' },
                    { icon: User, label: 'Profile' }
                ].map(({ icon: Icon, label, active }) => (
                    <button
                        key={label}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left ${active
                            ? `bg-gradient-to-r ${designSystem.gradients.primary} text-white shadow-lg shadow-blue-600/30`
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default MobileMenu;