import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Search, Bell, Plus, Home, User, Compass, Bookmark, MapPin, TrendingUp, Sparkles, Globe, Users, Calendar, Image, Smile, Send, ChevronRight, Filter, Zap, Menu } from 'lucide-react';
import designSystem from '../utils/designSystem'

const NavigationBar = ({setShowNewPost, setMobileMenuOpen, showNewPost, mobileMenuOpen}) => {

    return (
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
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 text-gray-600"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavigationBar;