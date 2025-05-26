import React from 'react';
import { Home, Compass, Plus, User, Bookmark } from 'lucide-react';

const MobileBottomNavigation = ({ currentView, setView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 lg:hidden z-50">
      <div className="flex justify-around py-3">
        <button 
          onClick={() => setView('home')} 
          className={`p-2 ${currentView === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Home className="w-6 h-6 mx-auto" />
        </button>
        <button 
          onClick={() => setView('explore')} 
          className={`p-2 ${currentView === 'explore' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Compass className="w-6 h-6 mx-auto" />
        </button>
        <button 
          onClick={() => setView('create')} 
          className="p-2 text-gray-600"
        >
          <div className="bg-blue-600 text-white rounded-full p-2">
            <Plus className="w-6 h-6 mx-auto" />
          </div>
        </button>
        <button 
          onClick={() => setView('saved')} 
          className={`p-2 ${currentView === 'saved' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Bookmark className="w-6 h-6 mx-auto" />
        </button>
        <button 
          onClick={() => setView('profile')} 
          className={`p-2 ${currentView === 'profile' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <User className="w-6 h-6 mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;