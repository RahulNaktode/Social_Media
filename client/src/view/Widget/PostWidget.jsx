import Friend from '../../components/Friend.jsx';
import { getUserJwtToken, getUserData } from './../../utils.jsx';
import axios from 'axios';
import HeartImg from './../../assets/heart.png';
import DisHeartImg from '../../assets/disheart.png';
import { MessageSquareText, Share2 } from 'lucide-react';
import { useState } from 'react';
import PhotoViwer from '../../components/PhotoViwer.jsx';

function PostWidget({ postId, postUserId, name, description, location, picturePath, userPicturePath, likes, comments }) {

  const [isComments, setIsComments] = useState(false);
  const user = getUserData();
  const userId = user?._id;
  console.log(postUserId);

  const [likesState, setLikesState] = useState(likes || {});

  const isLiked = Boolean(likesState?.[userId]);
  const likesCount = Object.keys(likesState || {}).length;

  const patchLike = async () => {
    const response = await axios.patch(`http://localhost:8080/posts/${postId}/like`, { userId }, {
      headers: {
        Authorization: `Bearer ${getUserJwtToken()}`
      }
    })
    const updatedLikes = response.data?.data?.likes || {};

    setLikesState(updatedLikes);
  }


  return (
    <div className='border border-gray-300 shadow px-5 py-6 w-full max-w-150 mt-5 rounded'>
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
          
          <div className='flex items-center gap-1'>
            <img 
              src={isLiked ? HeartImg : DisHeartImg} 
              alt="like icon" 
              onClick={patchLike} 
              className='cursor-pointer w-6 h-6 hover:scale-110 transition-transform' 
            />
            <span className='text-sm font-medium'>{likesCount}</span>
          </div>

          <div 
            className='flex items-center gap-1 cursor-pointer hover:opacity-70' 
            onClick={() => setIsComments(!isComments)}
          >
            <MessageSquareText size={22} />
            <span className='text-sm font-medium'>{comments.length}</span>
          </div>
        </div>

        <Share2 className='cursor-pointer hover:opacity-70' size={20} />
      </div>

      {isComments && (
        <div className='mt-4 border-t pt-3'>
          {comments.map((comment, index) => (
            <div key={`${postId}-comment-${index}`} className='mb-2 last:mb-0'>
              <p className='text-gray-700 text-sm bg-gray-50 p-2 rounded'>
                {comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PostWidget
