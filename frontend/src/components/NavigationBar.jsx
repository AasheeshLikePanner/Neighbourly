import React, { useState, useRef } from 'react';
import { Search, MapPin, Users, X, ChevronDown, Bell, Plus, Menu, Filter } from 'lucide-react';
import designSystem from '../utils/designSystem';
import { useNavigate } from 'react-router-dom';

const NavigationBar = ({ user, setShowNewPost, setMobileMenuOpen, showNewPost, mobileMenuOpen }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showBadgeDialog, setShowBadgeDialog] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const searchRef = useRef(null);

  // Sample badge data
  const availableBadges = [
    { id: '1', name: 'Verified', icon: '✅' },
    { id: '2', name: 'Popular', icon: '🔥' },
    { id: '3', name: 'Newcomer', icon: '🆕' },
    { id: '4', name: 'Influencer', icon: '⭐' },
  ];

  const handleBadgeToggle = (badgeId) => {
    setSelectedBadges(prev => 
      prev.includes(badgeId)
        ? prev.filter(id => id !== badgeId)
        : [...prev, badgeId]
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Format the search query with filters
    let query = searchQuery;
    if (selectedLocation) query += ` location:${selectedLocation}`;
    if (selectedBadges.length > 0) {
      const badgeNames = selectedBadges.map(id => 
        availableBadges.find(b => b.id === id)?.name.toLowerCase()
      ).join(',');
      query += ` badges:${badgeNames}`;
    }
    console.log('Searching for:', query.trim());
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBadges([]);
    setSelectedLocation('');
  };

  const BadgeDialog = () => (
    <div className="fixed backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Filter by Badges</h3>
          <button 
            onClick={() => setShowBadgeDialog(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {availableBadges.map(badge => (
            <div 
              key={badge.id} 
              onClick={() => handleBadgeToggle(badge.id)}
              className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                selectedBadges.includes(badge.id) 
                  ? 'bg-blue-50 ring-2 ring-blue-200' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                selectedBadges.includes(badge.id) ? 'bg-blue-100' : 'bg-white'
              }`}>
                <span className="text-lg">{badge.icon}</span>
              </div>
              <span className="font-medium text-gray-900">{badge.name}</span>
              {selectedBadges.includes(badge.id) && (
                <div className="ml-auto w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-6 space-x-3">
          <button 
            onClick={() => setShowBadgeDialog(false)}
            className="px-6 py-3 rounded-2xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => setShowBadgeDialog(false)}
            className="px-6 py-3 rounded-2xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200/50"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`w-12 h-12 bg-gradient-to-br ${designSystem.gradients.brand} rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200/30`}>
                  <span className="text-white font-black text-lg">NB</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg" />
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Neighbourly
                </h1>
                <p className="text-xs text-gray-500 font-semibold -mt-1">Community First</p>
              </div>
            </div>
          </div>

          {/* Modern Search Card */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative bg-white rounded-3xl shadow-lg shadow-gray-100/50 ring-1 ring-gray-100 overflow-hidden">
                <div className="flex items-center">
                  {/* Search Input */}
                  <div className="flex-1 flex items-center px-6 py-4">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search communities, people, events..."
                      className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400 text-gray-900"
                    />
                  </div>
                  
                  {/* Filter Cards */}
                  <div className="flex items-center space-x-2 pr-4">
                    {/* Location Filter */}
                    <button
                      type="button"
                      onClick={() => {
                        const loc = prompt("Enter location (city name):");
                        if (loc !== null) setSelectedLocation(loc);
                      }}
                      className={`p-3 rounded-2xl transition-all duration-200 ${
                        selectedLocation 
                          ? 'bg-blue-100 text-blue-600 shadow-lg shadow-blue-100/50' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                    
                    {/* Badge Filter */}
                    <button
                      type="button"
                      onClick={() => setShowBadgeDialog(true)}
                      className={`p-3 rounded-2xl transition-all duration-200 relative ${
                        selectedBadges.length > 0 
                          ? 'bg-purple-100 text-purple-600 shadow-lg shadow-purple-100/50' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      {selectedBadges.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {selectedBadges.length}
                        </div>
                      )}
                    </button>
                    
                    {/* Clear Button */}
                    {(searchQuery || selectedLocation || selectedBadges.length > 0) && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            {/* Notification Card */}
            <div className="relative p-3 bg-white rounded-2xl shadow-lg shadow-gray-100/50 hover:shadow-gray-200/70 transition-all duration-200 cursor-pointer">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                3
              </div>
            </div>

            {/* Create Post Card */}
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className={`bg-gradient-to-r ${designSystem.gradients.primary} text-white px-6 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-200 shadow-xl shadow-blue-200/40 hover:shadow-blue-300/60 hover:scale-105 font-semibold`}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create</span>
            </button>

            {/* Profile Card */}
            <div 
              onClick={() => navigate(`/profile/${user.username}`)}
              className="relative p-1 bg-white rounded-2xl shadow-lg shadow-gray-100/50 hover:shadow-gray-200/70 transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <img
                src={user.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white" />
            </div>

            {/* Mobile Menu */}
            <button
              className="lg:hidden p-3 bg-white rounded-2xl shadow-lg shadow-gray-100/50 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Badge Selection Dialog */}
      {showBadgeDialog && <BadgeDialog />}

      {/* Active Filters Preview */}
      {(searchQuery || selectedLocation || selectedBadges.length > 0) && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-xl shadow-gray-200/50 text-sm text-gray-600 flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span>
              <span className="font-semibold text-gray-900">Searching:</span> {searchQuery || 'All'} 
              {selectedLocation && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                  📍 {selectedLocation}
                </span>
              )}
              {selectedBadges.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                  🏷️ {selectedBadges.length} badge{selectedBadges.length > 1 ? 's' : ''}
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;