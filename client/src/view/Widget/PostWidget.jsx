import Friend from '../../components/Friend.jsx';
import { getUserJwtToken, getUserData } from './../../utils.jsx';
import axios from 'axios';
import HeartImg from './../../assets/heart.png';
import DisHeartImg from '../../assets/disheart.png';
import { MessageSquareText, Share2 } from 'lucide-react';
import { FavoriteBorderOutlined, FavoriteOutlined } from '@mui/icons-material';
import { useState } from 'react';
import PhotoViwer from '../../components/PhotoViwer.jsx';
import { useParams } from 'react-router';

function PostWidget({ postId, postUserId, name, description, location, picturePath, userPicturePath, likes, comments }) {
  const [isComments, setIsComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [currentComments, setCurrentComments] = useState(comments || []);
  const  userId  = getUserData()._id;

  const [likesState, setLikesState] = useState(likes || {});
  const isLiked = Boolean(likesState?.[userId]);
  const likesCount = Object.keys(likesState || {}).length;

  const patchLike = async () => {
    const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/like`, { userId }, {
      headers: {
        Authorization: `Bearer ${getUserJwtToken()}`
      }
    })
    const updatedLikes = response.data?.data?.likes || {};
    setLikesState(updatedLikes);
  }

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comment`, 
        { userId, comment: commentText }, 
        {
          headers: {
            Authorization: `Bearer ${getUserJwtToken()}`
          }
        }
      );
      setCurrentComments([...currentComments, commentText]);
      setCommentText("");
    } catch (error) {
      console.error("Comment post karne mein error:", error);
    }
  }

  const handleShare = async () => {
  const shareData = {
    title: `Post by ${name}`,
    text: description,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      console.log("Shared successfully!");
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard! Share it anywhere.");
    }
  } catch (err) {
    console.error("Error sharing:", err);
  }
};

  return (
    <div className='border border-gray-300 shadow px-5 py-6 w-full max-w-140 mt-5 rounded '>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      
      <p className='text-gray-500 mt-4 mx-3'>{description}</p>
      
      {picturePath && (
        <div className='mt-4'>
          <PhotoViwer imageUrl={picturePath} />
        </div>
      )}

      <div className='flex items-center justify-between mt-5'>
        <div className='flex items-center gap-4'>
          
          {/* Like Section */}
          <div className='flex items-center gap-1'>
            {isLiked ? (
              <FavoriteOutlined 
                size={22}
                className='text-red-500 cursor-pointer hover:scale-110 transition-transform'
                onClick={patchLike}
              />
            ) : (
              <FavoriteBorderOutlined 
                size={22}
                className='cursor-pointer hover:scale-110 transition-transform'
                onClick={patchLike}
              />
            )}

            <span className='text-sm font-medium'>{likesCount}</span>
          </div>

          {/* Comment Icon (Toggle) */}
          <div 
            className='flex items-center gap-1 cursor-pointer hover:opacity-70' 
            onClick={() => setIsComments(!isComments)}
          >
            <MessageSquareText size={22} className='hover:scale-110 transition-transform'/>
            <span className='text-sm font-medium'>{currentComments.length}</span>
          </div>
        </div>

        <div 
  className='flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-2 rounded-full transition'
  onClick={handleShare}
>
  <Share2 size={20} className='opacity-70 hover:scale-110 transition-transform' />
  <span className='text-xs font-medium'>Share</span>
</div>
      </div>

      {isComments && (
        <div className='mt-4 border-t pt-3'>
          
          <div className='flex gap-2 mb-4'>
            <input 
                type="text" 
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()} // Enter press karne par post ho jaye
                className='flex-1 border border-gray-200 rounded-full px-4 py-1 text-sm outline-none focus:border-blue-400 bg-gray-50'
            />
            <button 
                onClick={handlePostComment}
                className='text-blue-500 font-semibold text-sm hover:text-blue-700'
            >
                Post
            </button>
          </div>

          <div className='max-h-52 overflow-y-auto space-y-2'>
            {currentComments.map((comment, index) => (
                <div key={`${postId}-comment-${index}`} className='bg-gray-50 p-2 rounded-lg'>
                  <p className='text-gray-700 text-sm'>
                    {comment}
                  </p>
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostWidget;