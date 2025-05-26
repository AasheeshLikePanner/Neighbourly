import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Smile, MapPin, Send, X, ChevronDown, Loader2, LocateIcon } from 'lucide-react';
import designSystem from '../utils/designSystem';
import { useForm } from 'react-hook-form';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { createPost } from '../apis/post.api';
import POST_TYPES from '../utils/postTypes';
import useStore from '../store/store';

const CreatePost = ({ onPostCreated }) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      type: 'update'
    }
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPostTypeDropdown, setShowPostTypeDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [customLocation, setCustomLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const emojiPickerRef = useRef(null);
  const locationInputRef = useRef(null);
  const postTypeDropdownRef = useRef(null);
  const {user} = useStore()

  const content = watch('content', '');
  const postType = watch('type', 'update');
  const currentPostType = POST_TYPES.find(type => type.value === postType) || POST_TYPES[2];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (postTypeDropdownRef.current && !postTypeDropdownRef.current.contains(event.target)) {
        setShowPostTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus location input when opened
  useEffect(() => {
    if (showLocationInput && locationInputRef.current) {
      locationInputRef.current.focus();
    }
  }, [showLocationInput]);

  // Get user's location on component mount
  useEffect(() => {
    getLocation();
  }, []);

  const onEmojiClick = useCallback((emojiData) => {
    setValue('content', content + emojiData.emoji);
    setShowEmojiPicker(false);
  }, [content, setValue]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name, file.size); // Add this line

    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectPostType = (type) => {
    setValue('type', type);
    setShowPostTypeDropdown(false);
  };

  const searchLocations = useCallback(debounce(async (query) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearchingLocations(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );

      const suggestions = response.data.map(item => ({
        displayName: formatDisplayName(item),
        latitude: item.lat,
        longitude: item.lon,
        address: item.address
      }));

      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsSearchingLocations(false);
    }
  }, 300), []);

  const formatDisplayName = useCallback((item) => {
    const { address } = item;
    if (!address) return item.display_name;

    return [
      address.road,
      address.neighbourhood,
      address.suburb,
      address.village,
      address.town,
      address.city,
      address.state,
      address.country
    ].filter(Boolean).join(', ');
  }, []);

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) return;

    setIsFetchingLocation(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0
        });
      });

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1`
      );

      const displayName = formatDisplayName(response.data);

      setUserLocation({
        displayName,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: response.data.address
      });
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsFetchingLocation(false);
    }
  }, [formatDisplayName]);

  const handleLocationInputChange = useCallback((e) => {
    const value = e.target.value;
    setCustomLocation(value);
    searchLocations(value);
  }, [searchLocations]);

  const selectLocation = useCallback((suggestion) => {
    setLocation(suggestion);
    setCustomLocation('');
    setLocationSuggestions([]);
    setShowLocationInput(false);
  }, []);

  const removeLocation = useCallback(() => {
    setLocation(null);
  }, []);

  const onSubmit = async (data) => {
    if (!data.content.trim() && !imagePreview) {
      alert('Please add some content or an image');
      return;
    }
    console.log("going");
    console.log('Selected file:', fileInputRef.current?.files?.[0]);


    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('type', data.type);

    const imageFile = fileInputRef.current?.files?.[0];
    if (imageFile) {
      console.log('Appending image file:', imageFile.name, imageFile.size);
      formData.append('image', imageFile); // This is the crucial line
    }

    if (location) {
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('city', location.displayName)
    }
    console.log(location);

    try {
      console.log('adsf');

      const response = await createPost(formData);
      console.log('df');

      if (onPostCreated) {
        onPostCreated(response.data);
      }

      reset();
      setImagePreview(null);
      setLocation(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 mb-6 border border-white/30 shadow-lg shadow-gray-200/20"
      style={{
        borderRadius: designSystem.borderRadius.xl,
        fontFamily: designSystem.typography.fontFamily.sans
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex space-x-4">
          <img
            src={user.avatar}
            alt="Your avatar"
            className="w-11 h-11 rounded-xl object-cover"
            style={{
              borderRadius: designSystem.borderRadius.base
            }}
          />
          <div className="flex-1 relative">
            <textarea
              {...register('content')}
              placeholder="What's happening in your community?"
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 resize-none text-base leading-relaxed"
              rows="3"
              style={{
                fontSize: designSystem.typography.fontSize.base
              }}
            />

            {/* Post Type Selector */}
            <div className="relative mb-3" ref={postTypeDropdownRef}>
              <button
                type="button"
                onClick={() => setShowPostTypeDropdown(!showPostTypeDropdown)}
                className="flex items-center text-sm rounded-full px-3 py-1.5 transition-all duration-200 border shadow-sm"
                style={{
                  backgroundColor: currentPostType.bgColor,
                  color: currentPostType.color,
                  borderColor: currentPostType.borderColor,
                  fontSize: designSystem.typography.fontSize.sm,
                  fontWeight: designSystem.typography.fontWeight.medium
                }}
              >
                <span className="mr-2">{currentPostType.icon}</span>
                <span>{currentPostType.label}</span>
                <ChevronDown
                  className="w-4 h-4 ml-2 transition-transform duration-200"
                  style={{ color: currentPostType.color }}
                />
              </button>

              {showPostTypeDropdown && (
                <div
                  className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden"
                  style={{
                    borderRadius: designSystem.borderRadius.base,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {POST_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => selectPostType(type.value)}
                      className="w-full text-left px-4 py-2.5 text-sm flex items-center transition-colors hover:bg-gray-50"
                      style={{
                        color: type.color,
                        backgroundColor: postType === type.value ? type.bgColor : 'transparent',
                        borderColor:type.borderColor,
                        fontWeight: postType === type.value
                          ? designSystem.typography.fontWeight.semibold
                          : designSystem.typography.fontWeight.normal
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {imagePreview && (
              <div className="relative mt-3 rounded-xl overflow-hidden transition-all duration-200">
                <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-xl" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                  style={{
                    borderRadius: designSystem.borderRadius.full
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {location && (
              <div className="mt-3 flex items-center transition-all duration-200">
                <div
                  className="px-3 py-1 rounded-full text-sm flex items-center max-w-full"
                  style={{
                    backgroundColor: `${designSystem.colors.primary.blue}10`,
                    color: designSystem.colors.primary.blue,
                    borderRadius: designSystem.borderRadius.full
                  }}
                >
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate" title={location.displayName}>
                    {location.displayName}
                  </span>
                  <button
                    type="button"
                    onClick={removeLocation}
                    className="ml-2 text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors duration-150"
                  style={{
                    borderRadius: designSystem.borderRadius.sm
                  }}
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                <div className="relative" ref={emojiPickerRef}>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors duration-150"
                    style={{
                      borderRadius: designSystem.borderRadius.sm
                    }}
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 z-10 transform translate-y-1">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        width={260}
                        height={300}
                        previewConfig={{ showPreview: false }}
                        skinTonesDisabled
                        searchDisabled
                        lazyLoadEmojis
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowLocationInput(!showLocationInput);
                    if (!showLocationInput) {
                      setLocationSuggestions([]);
                    }
                  }}
                  className={`p-2 rounded-lg transition-colors duration-150 ${location
                      ? 'text-green-500 hover:bg-green-50'
                      : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  style={{
                    borderRadius: designSystem.borderRadius.sm
                  }}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all duration-200 font-medium text-sm disabled:opacity-70 disabled:transform-none`}
                style={{
                  borderRadius: designSystem.borderRadius.base,
                  fontWeight: designSystem.typography.fontWeight.semibold
                }}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            {showLocationInput && (
              <div
                className="mt-4 p-3 bg-gray-50 rounded-lg transition-all duration-200"
                style={{
                  borderRadius: designSystem.borderRadius.base
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4
                    className="text-sm font-medium text-gray-700"
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      fontWeight: designSystem.typography.fontWeight.medium
                    }}
                  >
                    Add Location
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLocationInput(false);
                      setLocationSuggestions([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {userLocation && !location && (
                  <div className="mb-3 transition-all duration-150">
                    <button
                      type="button"
                      onClick={() => selectLocation(userLocation)}
                      className={`w-full text-left p-2 rounded-lg border flex items-center justify-between transition-colors ${isFetchingLocation
                          ? 'border-gray-200 bg-gray-100 text-gray-500'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
                        }`}
                      disabled={isFetchingLocation}
                      style={{
                        borderRadius: designSystem.borderRadius.sm
                      }}
                    >
                      <span className="flex items-center">
                        {isFetchingLocation ? (
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        ) : (
                          <MapPin className="w-3 h-3 mr-2 text-blue-500" />
                        )}
                        {isFetchingLocation ? 'Detecting location...' : (
                          <>
                            <span className="font-medium">Use current location</span>
                            <span className="ml-2 text-gray-500 truncate max-w-[180px]">
                              {userLocation.displayName}
                            </span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    ref={locationInputRef}
                    value={customLocation}
                    onChange={handleLocationInputChange}
                    placeholder="Search for a location..."
                    className="w-full text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    style={{
                      borderRadius: designSystem.borderRadius.sm,
                      fontSize: designSystem.typography.fontSize.sm
                    }}
                  />
                  {isSearchingLocations && (
                    <div className="absolute right-2 top-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>

                {locationSuggestions.length > 0 && (
                  <div
                    className="mt-2 border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
                    style={{
                      borderRadius: designSystem.borderRadius.sm
                    }}
                  >
                    {locationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectLocation(suggestion)}
                        className="w-full text-left p-2 hover:bg-gray-100 text-sm flex items-center transition-colors"
                        style={{
                          fontSize: designSystem.typography.fontSize.sm
                        }}
                      >
                        <MapPin className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{suggestion.displayName}</span>
                      </button>
                    ))}
                  </div>
                )}

                <p
                  className="text-xs text-gray-500 mt-2"
                  style={{
                    fontSize: designSystem.typography.fontSize.xs
                  }}
                >
                  Search for places, addresses, or landmarks
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;