import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  MapPin, Lock, Shield, Eye, EyeOff, Github,
  Users, Calendar, HelpCircle, Star, Compass, AlertCircle, Upload, User
} from 'lucide-react';
import { loginUser, signUpUser } from '../apis/apis';
import useStore from '../store/store'

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { user, setUser } = useStore()
  // Register form
  const { register: registerRegister, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors }, reset: resetRegister } = useForm();

  // Login form
  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm();

  useEffect(() => {
    console.log('Initial file input ref:', fileInputRef.current);
  }, []);
  // Check location permission on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          setLocationAllowed(true);
        }
      });
    }
  }, []);

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationAllowed(true);
        setLocationError(null);
      },
      (error) => {
        setLocationError('Location access is required to continue');
        setLocationAllowed(false);
      }
    );
  };

  const handleAvatarChange = (e) => {
    console.log('File input change triggered');
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('File size must be less than 2MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {  // Changed from onloadend to onload
        console.log('File read complete, setting preview');
        setAvatarPreview(reader.result);
      };

      // Add error handling
      reader.onerror = () => {
        console.error('Error reading file');
        setAvatarPreview(null);
      };

      // Start reading the file
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected');
      setAvatarPreview(null);
    }
  };

  const triggerFileInput = (e) => {
    if (e) e.preventDefault(); // Prevent default only if event exists
    console.log('Trigger file input clicked');
    if (fileInputRef.current) {
      console.log('Clicking file input');
      fileInputRef.current.click();
    } else {
      console.error('File input reference not found');
    }
  };

  const onRegisterSubmit = async (data) => {
    console.log(data);

    if (!locationAllowed) {
      setLocationError('Please allow location access to continue');
      return;
    }

    // Prepare FormData for API submission
    const submissionData = new FormData();
    submissionData.append('username', data.username);
    submissionData.append('email', data.email);
    submissionData.append('password', data.password);
    submissionData.append('fullName', data.fullName);

    if (data.avatar && data.avatar[0]) {
      submissionData.append('image', data.avatar[0]);
    }
    for (let pair of submissionData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }


    try {
      const response = await signUpUser(submissionData);
      console.log(response.data.data);
      setUser(response.data.data);
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error (show error message, etc.)
    }
  };

  const onLoginSubmit = async (data) => {
    if (!locationAllowed) {
      setLocationError('Please allow location access to continue');
      return;
    }

    try {
      // const response = await fetch('https://your-api-endpoint.com/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: data.email,
      //     password: data.password,
      //   }),
      // });
      const response = await loginUser(data);
      console.log(response.data);

      setUser(response.data.user);
      // Handle success (redirect, store token, etc.)
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (show error message, etc.)
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Authentication Form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Auth Tabs */}
          <div className="flex mb-8 rounded-xl p-1 bg-gray-100">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'login' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'register' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
            >
              Register
            </button>
          </div>

          {/* Register Form */}
          {activeTab === 'register' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h1 className="text-2xl font-bold mb-6 text-gray-900">Join your community</h1>

              <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center mb-4">
                  <div
                    onClick={triggerFileInput}
                    className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors relative"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    name="avatar"
                    ref={(e) => {
                      fileInputRef.current = e;
                      registerRegister('avatar').ref(e);
                    }}
                    onChange={(e) => {
                      registerRegister('avatar').onChange(e); // forward to RHF
                      handleAvatarChange(e); // custom preview logic
                    }}
                    accept="image/*"
                    className="hidden"
                  />


                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="mt-2 flex items-center justify-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Upload size={14} />
                    <span>Upload Avatar</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-1">Optional (Max 2MB)</p>
                </div>

                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border ${registerErrors.username ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="yourname"
                    {...registerRegister('username', { required: 'Username is required' })}
                  />
                  {registerErrors.username && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.username.message}</p>
                  )}
                </div>

                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border ${registerErrors.fullName ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Full Name"
                    {...registerRegister('fullName', { required: 'Full name is required' })}
                  />
                  {registerErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.fullName.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border ${registerErrors.email ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="you@example.com"
                    {...registerRegister('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {registerErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-3 rounded-xl border ${registerErrors.password ? 'border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12`}
                      placeholder="••••••••"
                      {...registerRegister('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {registerErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.password.message}</p>
                  )}
                </div>

                {/* Location Access */}
                <div className="pt-4">
                  <div className="flex items-start space-x-3">
                    <button
                      type="button"
                      onClick={handleLocationRequest}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${locationAllowed ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <MapPin size={16} />
                      <span>{locationAllowed ? 'Location Allowed' : 'Allow Location Access'}</span>
                    </button>
                    <div className="relative group">
                      <HelpCircle size={18} className="text-gray-400 mt-1" />
                      <div className="absolute left-full ml-2 w-64 p-3 bg-white rounded-lg shadow-lg text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-100">
                        We only use your location to personalize your feed. We do not store or track it.
                      </div>
                    </div>
                  </div>
                  {locationError && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <AlertCircle size={16} className="mr-1" />
                      {locationError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!locationAllowed}
                  className={`w-full py-3.5 px-4 text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center ${locationAllowed
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-95'
                    : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  <span>Create account</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h1 className="text-2xl font-bold mb-6 text-gray-900">Welcome back</h1>

              <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border ${loginErrors.email ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="you@example.com"
                    {...registerLogin('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {loginErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{loginErrors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-3 rounded-xl border ${loginErrors.password ? 'border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12`}
                      placeholder="••••••••"
                      {...registerLogin('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      {...registerLogin('rememberMe')}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>

                {/* Location Access */}
                <div className="pt-4">
                  <div className="flex items-start space-x-3">
                    <button
                      type="button"
                      onClick={handleLocationRequest}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${locationAllowed ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <MapPin size={16} />
                      <span>{locationAllowed ? 'Location Allowed' : 'Allow Location Access'}</span>
                    </button>
                    <div className="relative group">
                      <HelpCircle size={18} className="text-gray-400 mt-1" />
                      <div className="absolute left-full ml-2 w-64 p-3 bg-white rounded-lg shadow-lg text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-100">
                        We only use your location to personalize your feed. We do not store or track it.
                      </div>
                    </div>
                  </div>
                  {locationError && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <AlertCircle size={16} className="mr-1" />
                      {locationError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!locationAllowed}
                  className={`w-full py-3.5 px-4 text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center ${locationAllowed
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-95'
                    : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  <span>Login</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Platform Message & Trust */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                <Users className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                LocalConnect
              </h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Built to help locals connect, share updates, ask for help, and discover events in their area.
            </p>
            <p className="text-gray-600">
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
              <div key={index} className="bg-white/80 p-4 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-2 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="font-medium text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Privacy Assurance */}
          <div className="bg-white/90 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center">
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
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 mt-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center text-sm text-gray-500">
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