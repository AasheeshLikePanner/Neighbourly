import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, MapPin, 
  X, Send, Bookmark, ChevronDown, ChevronUp, Reply, User 
} from 'lucide-react';
import designSystem from '../utils/designSystem';
import formatTwitterDate  from '../utils/dateUtils';
import { Tooltip } from './Tooltip';
import { getPostById } from '../apis/post.api';
import { likePost, unlikePost } from '../apis/like.api';
import useStore from '../store/store';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);
        // Check if user liked this post
        if (user?._id && data.likes?.includes(user._id)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId, user]);

  const handleLike = async () => {
    if (!user?._id) return;
    
    try {
      const newLikeStatus = !isLiked;
      setIsLiked(newLikeStatus);
      console.log(newLikeStatus);
      
      if (newLikeStatus) {
        await likePost(postId, user._id);
      }else{
        await unlikePost(postId, user._id)
      }
      setPost(prev => ({
        ...prev,
        likeCount: newLikeStatus ? prev.likeCount + 1 : prev.likeCount - 1
      }));
    } catch (error) {
      console.error('Error updating like:', error);
      setIsLiked(!isLiked); // Revert on error
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    // TODO: Implement comment submission
    console.log('Posting comment:', commentText);
    setCommentText('');
    setReplyingTo(null);
  };

  const toggleCommentExpand = (commentId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold">Post not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg">Post</h2>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              {post.userDetails[0].avatar ? (
                <img src={post.userDetails[0].avatar} alt={post.userDetails[0].username} className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full text-gray-400 p-1" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold">{post.userDetails[0].fullName}</span>
                <span className="text-gray-500 text-sm">@{post.userDetails[0].username}</span>
              </div>
              <p className="mt-1 text-gray-800">{post.content}</p>
              
              {post.image && (
                <div className="mt-3 rounded-4xl overflow-hidden">
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="rounded-2xl w-full max-h-[500px] object-contain" 
                  />
                </div>
              )}
              
              <div className="mt-3 text-sm text-gray-500 flex items-center space-x-2">
                <span>{formatTwitterDate(post.createdAt)}</span>
                <span>•</span>
                <Tooltip content={post.city}>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{post.city}</span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{post.likeCount}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments?.length || 0}</span>
              </button>
              <button className="text-gray-500">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <button className="text-gray-500">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-4">Comments</h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full text-gray-400 p-1" />
                )}
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={replyingTo ? `Replying to @${replyingTo.username}` : "Add a comment..."}
                  className="w-full px-4 py-2 bg-gray-50 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 ${commentText.trim() ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments?.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment._id} className="group">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {comment.user.avatar ? (
                        <img src={comment.user.avatar} alt={comment.user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full text-gray-400 p-1" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm">{comment.user.fullName}</span>
                            <span className="text-xs text-gray-500">@{comment.user.username}</span>
                          </div>
                          <button 
                            onClick={() => setReplyingTo(comment.user)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600"
                          >
                            <Reply className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-800 text-sm">{comment.text}</p>
                      </div>

                      {/* Replies */}
                      {comment.replies?.length > 0 && (
                        <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-200">
                          <button
                            onClick={() => toggleCommentExpand(comment._id)}
                            className="flex items-center text-xs text-blue-600 hover:text-blue-800 mb-2"
                          >
                            {expandedComments.has(comment._id) ? (
                              <>
                                <ChevronUp className="w-3 h-3 mr-1" />
                                Hide {comment.replies.length} replies
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3 mr-1" />
                                Show {comment.replies.length} replies
                              </>
                            )}
                          </button>

                          {expandedComments.has(comment._id) && (
                            <div className="space-y-3">
                              {comment.replies.map(reply => (
                                <div key={reply._id} className="flex items-start space-x-3 group">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {reply.user.avatar ? (
                                      <img src={reply.user.avatar} alt={reply.user.username} className="w-full h-full object-cover" />
                                    ) : (
                                      <User className="w-full h-full text-gray-400 p-0.5" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-gray-50 rounded-xl p-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-bold text-xs">{reply.user.fullName}</span>
                                          <span className="text-xs text-gray-500">@{reply.user.username}</span>
                                        </div>
                                        <button 
                                          onClick={() => setReplyingTo(reply.user)}
                                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600"
                                        >
                                          <Reply className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <p className="text-gray-800 text-xs">{reply.text}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No comments yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;