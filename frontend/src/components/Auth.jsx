import { useState, useEffect } from 'react';
import { 
  MapPin, Lock, Shield, Eye, EyeOff, Github, 
  Users, Calendar, HelpCircle, Star, Compass 
} from 'lucide-react';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode based on system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Design tokens
  const colors = {
    light: {
      primary: '#2563eb',
      background: '#f8fafc',
      card: 'rgba(255, 255, 255, 0.9)',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#3b82f6',
      background: '#0f172a',
      card: 'rgba(15, 23, 42, 0.8)',
      text: '#f8fafc',
      muted: '#94a3b8'
    }
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}
      style={{ backgroundColor: currentColors.background }}>
      
      {/* Left Side - Authentication Form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Auth Tabs */}
          <div className="flex mb-8 rounded-xl p-1 bg-gray-100 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'login' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500 dark:text-slate-400'}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'register' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500 dark:text-slate-400'}`}
            >
              Register
            </button>
          </div>

          {/* Auth Form */}
          <div className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-700/50">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {activeTab === 'login' ? 'Welcome back' : 'Join your community'}
            </h1>

            <form className="space-y-4">
              {activeTab === 'register' && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="yourname"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {activeTab === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-slate-400">
                      Remember me
                    </span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                {activeTab === 'login' ? 'Login' : 'Create account'}
              </button>
            </form>

            {/* Location Access */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700/50">
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => setLocationAllowed(!locationAllowed)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${locationAllowed ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300'}`}
                >
                  <MapPin size={16} />
                  <span>{locationAllowed ? 'Location Allowed' : 'Allow Location Access'}</span>
                </button>
                <div className="relative group">
                  <HelpCircle size={18} className="text-gray-400 dark:text-slate-500 mt-1" />
                  <div className="absolute left-full ml-2 w-64 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-xs text-gray-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-100 dark:border-slate-700">
                    We only use your location to personalize your feed. We do not store or track it.
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* OAuth */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 py-2 px-4 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM7 8v2h3.5v2H7v2h4a4 4 0 1 0 0-8H7z" />
                </svg>
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-2 px-4 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 0 1 10 10c0 4.42-2.87 8.17-6.84 9.5-.5.08-.66-.23-.66-.5v-1.7c0-.84-.3-1.39-.6-1.67 2.03-.22 4.16-.99 4.16-4.45 0-.98-.35-1.78-.92-2.4.09-.23.4-1.14-.09-2.38 0 0-.75-.24-2.45.92-.72-.2-1.48-.3-2.25-.3-.77 0-1.53.1-2.25.3-1.7-1.16-2.45-.92-2.45-.92-.49 1.24-.18 2.15-.09 2.38-.57.62-.92 1.42-.92 2.4 0 3.46 2.13 4.23 4.16 4.45-.26.21-.5.63-.5 1.27v1.89c0 .27-.16.59-.67.5C2.87 18.17 0 14.42 0 10A10 10 0 0 1 10 0z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Platform Message & Trust */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                <Users className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                LocalConnect
              </h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-slate-300 mb-6">
              Built to help locals connect, share updates, ask for help, and discover events in their area.
            </p>
            <p className="text-gray-600 dark:text-slate-400">
              Focused on Indian states and communities.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: <HelpCircle size={20} />, title: "Help", desc: "Ask and offer help locally" },
              { icon: <Calendar size={20} />, title: "Events", desc: "Discover nearby events" },
              { icon: <Star size={20} />, title: "Recommendations", desc: "Get local suggestions" },
              { icon: <Shield size={20} />, title: "Safety", desc: "Verified community members" }
            ].map((feature, index) => (
              <div key={index} className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-2 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Privacy Assurance */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
              <Lock className="mr-2" size={18} /> Privacy Assurance
            </h3>
            <ul className="space-y-3">
              {[
                "We never store or track your location",
                "Your location stays on your device",
                "100% open-source and verifiable codebase",
                "No surveillance, no profiling, just authentic community"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mr-2 mt-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-slate-500">
              <Github className="mr-2" size={16} />
              <a href="#" className="hover:underline">View our source code</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;