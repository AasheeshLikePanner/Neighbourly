import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Search, Bell, Plus, Home, User, Compass, Bookmark, MapPin, TrendingUp, Sparkles, Globe, Users, Calendar, Image, Smile, Send, ChevronRight, Filter, Zap, Menu } from 'lucide-react';
import designSystem from '../utils/designSystem'

const RightSide = () => {

    return (
        <div className="hidden lg:block w-80 shrink-0">
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
                                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: '73%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">267/400 XP to next level</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightSide;