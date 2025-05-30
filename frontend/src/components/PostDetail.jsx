import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart, MessageCircle, Share2, X, Send, Bookmark,
  ChevronDown, ChevronUp, Reply, User, MapPin, Maximize, Minimize
} from 'lucide-react';
import designSystem from '../utils/designSystem';
import formatTwitterDate from '../utils/dateUtils';
import { Tooltip } from './Tooltip';
import { getPostById } from '../apis/post.api';
import { likePost, unlikePost, likeComment, unlikeComment } from '../apis/like.api';
import useStore from '../store/store';
import { addCommentInPost } from '../apis/comment.api';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  console.log(user);
  console.log(post);

  // Check if post or comment is liked
  const isLiked = useCallback((likes = []) => {
    return user?._id && likes.includes(user._id);
  }, [user?._id]);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => { setPost(post) }, [post])

  // Handle post like
  const handlePostLike = async () => {
    if (!user?._id) return;

    try {
      const newLikeStatus = !isLiked(post.likes || []);

      if (newLikeStatus) {
        await likePost(postId, user._id);
        setPost(prev => ({
          ...prev,
          likes: [...(prev.likes || []), user._id],
          likeCount: prev.likeCount + 1
        }));
      } else {
        await unlikePost(postId, user._id);
        setPost(prev => ({
          ...prev,
          likes: prev.likes.filter(id => id !== user._id),
          likeCount: prev.likeCount - 1
        }));
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  // Handle comment like
  const handleCommentLike = async (commentId, currentLikes = []) => {
    if (!user?._id) return;

    try {
      const newLikeStatus = !isLiked(currentLikes);

      if (newLikeStatus) {
        await likeComment(commentId, user._id);
      } else {
        await unlikeComment(commentId, user._id);
      }

      // Update the comment in the post state
      setPost(prev => {
        const updatedComments = prev.commentDetails.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              likes: newLikeStatus
                ? [...(comment.likes || []), user._id]
                : (comment.likes || []).filter(id => id !== user._id),
              likeCount: newLikeStatus ? comment.likeCount + 1 : comment.likeCount - 1
            };
          }
          return comment;
        });

        return {
          ...prev,
          commentDetails: updatedComments
        };
      });
    } catch (error) {
      console.error('Error updating comment like:', error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      // setPost(prev => ({
      //   ...prev,
      //   commentDetails: [newComment, ...prev.commentDetails]
      // }));
      e.preventDefault();
      if (!commentText.trim() || !user) return;

      const tmepData = {
        _id: `temp-${Date.now()}`,
        content: commentText.trim(),
        likeCount: 0,
        createdAt: new Date().toISOString(),
        commentOwner: {
          _id: user._id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar
        }
      };
      await addCommentInPost(postId, commentText.trim());

      setPost(prev => ({
        ...prev,
        commentDetails: [tmepData, ...prev.commentDetails]
      }));
      setCommentText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Image handlers
  const handleImageClick = () => {
    setIsImageOpen(true);
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleCloseImage = (e) => {
    if (e.target === e.currentTarget) {
      setIsImageOpen(false);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const newScale = Math.min(Math.max(0.5, imageScale + delta * 0.001), 3);
    setImageScale(newScale);
  };

  const handleMouseDown = (e) => {
    if (imageScale <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || imageScale <= 1) return;
    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: designSystem.colors.primary.blue }}
        ></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ color: designSystem.colors.neutral.gray800 }}>
            Post not found
          </h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 rounded-full font-medium"
            style={{
              backgroundColor: designSystem.colors.primary.blue,
              color: 'white'
            }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: designSystem.colors.neutral.gray50 }}
    >
      {/* Image Modal */}
      {isImageOpen && post?.image && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={handleCloseImage}
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsImageOpen(false)}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              style={{ borderRadius: designSystem.borderRadius.full }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
            <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {imageScale > 1 ? 'Scroll to zoom • Drag to pan' : 'Scroll to zoom'}
            </div>
          </div>
          <div
            className="relative max-w-full max-h-full"
            ref={imageRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={post.image}
              alt="Post content"
              className="max-w-full max-h-screen object-contain cursor-grab active:cursor-grabbing"
              style={{
                transform: `scale(${imageScale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="min-h-screen">
        {/* Header */}
        <div
          className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b p-4"
          style={{
            borderColor: designSystem.colors.neutral.gray200,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{ borderRadius: designSystem.borderRadius.full }}
            >
              <X className="w-5 h-5" />
            </button>
            <h2
              className="font-bold text-lg"
              style={{ color: designSystem.colors.neutral.gray800 }}
            >
              Post
            </h2>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Post Content */}
        <div
          className="p-4 md:p-6 border-b"
          style={{
            borderColor: designSystem.colors.neutral.gray200,
            backgroundColor: 'white'
          }}
        >
          <div className="flex items-start space-x-3 md:space-x-4 mb-4">
            <div
              className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden"
              style={{
                backgroundColor: designSystem.colors.neutral.gray200,
                borderRadius: designSystem.borderRadius.full
              }}
            >
              {post.userDetails.avatar ? (
                <img
                  src={post.userDetails.avatar}
                  alt={post.userDetails.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User
                  className="w-full h-full p-2"
                  style={{ color: designSystem.colors.neutral.gray400 }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span
                  className="font-bold truncate text-sm md:text-base"
                  style={{ color: designSystem.colors.neutral.gray800 }}
                >
                  {post.userDetails.fullName}
                </span>
                <span
                  className="text-xs md:text-sm truncate cursor-pointer"
                  style={{ color: designSystem.colors.neutral.gray500 }}
                  onClick={() => navigate(`/profile/${post.userDetails.username}`)}
                >
                  @{post.userDetails.username}
                </span>
              </div>
              <p
                className="mt-1 md:mt-2 text-sm md:text-base"
                style={{ color: designSystem.colors.neutral.gray800 }}
              >
                {post.content}
              </p>

              {post.image && (
                <div
                  className="mt-3 md:mt-4 overflow-hidden relative group"
                  style={{ borderRadius: designSystem.borderRadius.xl }}
                >
                  <div className="relative">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-auto max-h-[50vh] md:max-h-[70vh] object-contain rounded-xl cursor-pointer transition-transform duration-200 group-hover:brightness-95"
                      onClick={handleImageClick}
                      style={{ borderRadius: designSystem.borderRadius.lg }}
                    />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handleImageClick}
                        className="p-2 bg-black/50 text-white rounded-full backdrop-blur-sm"
                        style={{ borderRadius: designSystem.borderRadius.full }}
                      >
                        <Maximize className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div
                className="mt-2 md:mt-4 text-xs md:text-sm flex items-center space-x-2 md:space-x-3"
                style={{ color: designSystem.colors.neutral.gray500 }}
              >
                <span>{formatTwitterDate(post.createdAt)}</span>
                {post.city && (
                  <>
                    <span>•</span>
                    <Tooltip content={post.city}>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{post.city.split(',')[0]}</span>
                      </div>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Post Actions */}
          <div
            className="flex items-center justify-between pt-3 md:pt-4 border-t mt-3 md:mt-4"
            style={{ borderColor: designSystem.colors.neutral.gray200 }}
          >
            <div className="flex items-center space-x-4 md:space-x-8">
              <button
                onClick={handlePostLike}
                className={`flex items-center space-x-1 transition-colors ${isLiked(post.likes || []) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                style={{ color: isLiked(post.likes || []) ? designSystem.colors.secondary.red : designSystem.colors.neutral.gray500 }}
              >
                <Heart
                  className={`w-4 h-4 md:w-5 md:h-5 ${isLiked(post.likes || []) ? 'fill-current' : ''}`}
                />
                <span className="text-xs md:text-sm">{post.likeCount}</span>
              </button>
              <button
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                style={{ color: designSystem.colors.neutral.gray500 }}
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm">{post.commentDetails?.length || 0}</span>
              </button>
              <button
                className="text-gray-500 hover:text-blue-500 transition-colors"
                style={{ color: designSystem.colors.neutral.gray500 }}
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            <button
              className="text-gray-500 hover:text-blue-500 transition-colors"
              style={{ color: designSystem.colors.neutral.gray500 }}
            >
              <Bookmark className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div
          className="p-4 md:p-6"
          style={{ backgroundColor: 'white' }}
        >
          <h3
            className="font-bold text-base md:text-lg mb-4 md:mb-6"
            style={{ color: designSystem.colors.neutral.gray800 }}
          >
            Comments
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6 md:mb-8">
            <div className="flex items-start space-x-3">
              <div
                className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0"
                style={{
                  backgroundColor: designSystem.colors.neutral.gray200,
                  borderRadius: designSystem.borderRadius.full
                }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <User
                    className="w-full h-full p-1.5 md:p-2"
                    style={{ color: designSystem.colors.neutral.gray400 }}
                  />
                )}
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={replyingTo ? `Replying to @${replyingTo.username}` : "Add a comment..."}
                  className="w-full px-3 py-2 md:px-4 md:py-3 rounded-full focus:ring-2 outline-none transition-all text-sm md:text-base"
                  style={{
                    backgroundColor: designSystem.colors.neutral.gray100,
                    borderRadius: designSystem.borderRadius.full,
                    color: designSystem.colors.neutral.gray800,
                    border: `1px solid ${designSystem.colors.neutral.gray200}`,
                    focusRingColor: designSystem.colors.primary.blue
                  }}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className={`absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-1 transition-colors ${commentText.trim() ? 'text-blue-600' : 'text-gray-400'}`}
                  style={{
                    color: commentText.trim() ? designSystem.colors.primary.blue : designSystem.colors.neutral.gray400
                  }}
                >
                  <Send className="w-4 h-4 md:w-5 md-h-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 md:space-y-6">
            {post.commentDetails?.length > 0 ? (
              post.commentDetails.map(comment => (
                <div key={comment._id} className="group">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0"
                      style={{
                        backgroundColor: designSystem.colors.neutral.gray200,
                        borderRadius: designSystem.borderRadius.full
                      }}
                    >
                      {comment.commentOwner.avatar ? (
                        <img
                          src={comment.commentOwner.avatar}
                          alt={comment.commentOwner.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User
                          className="w-full h-full p-1.5 md:p-2"
                          style={{ color: designSystem.colors.neutral.gray400 }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="rounded-xl p-3 md:p-4 transition-colors"
                        style={{
                          backgroundColor: designSystem.colors.neutral.gray100,
                          borderRadius: designSystem.borderRadius.lg
                        }}
                      >
                        <div className="flex items-center justify-between mb-1 md:mb-2">
                          <div className="flex items-center space-x-2">
                            <span
                              className="font-bold text-xs md:text-sm truncate"
                              style={{ color: designSystem.colors.neutral.gray800 }}
                            >
                              {comment.commentOwner.fullName}
                            </span>
                            <span
                              className="text-xs truncate cursor-pointer hover:text-amber-300"
                              onClick={() => navigate(`/profile/${comment.commentOwner.username}`)}
                              style={{ color: designSystem.colors.neutral.gray500, cursor: 'pointer'  }}
                            >
                              @{comment.commentOwner.username}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleCommentLike(comment._id, comment.likes || [])}
                              className={`flex items-center space-x-1 ${isLiked(comment.likes || []) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                            >
                              <Heart
                                className={`w-3 h-3 md:w-4 md:h-4 ${isLiked(comment.likes || []) ? 'fill-current' : ''}`}
                              />
                              <span className="text-xs">{comment.likeCount || 0}</span>
                            </button>
                            <button
                              onClick={() => setReplyingTo(comment.commentOwner)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: designSystem.colors.neutral.gray400 }}
                            >
                              <Reply className="w-3 h-3 md:w-4 md:h-4 hover:text-blue-600" />
                            </button>
                          </div>
                        </div>
                        <p
                          className="text-xs md:text-sm"
                          style={{ color: designSystem.colors.neutral.gray700 }}
                        >
                          {comment.content}
                        </p>
                        <div
                          className="mt-2 text-xs"
                          style={{ color: designSystem.colors.neutral.gray500 }}
                        >
                          {formatTwitterDate(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="text-center py-8 md:py-12"
                style={{ color: designSystem.colors.neutral.gray500 }}
              >
                <MessageCircle
                  className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-4"
                  style={{ color: designSystem.colors.neutral.gray300 }}
                />
                <p className="text-sm md:text-base">No comments yet</p>
                <p className="text-xs md:text-sm mt-1">Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;