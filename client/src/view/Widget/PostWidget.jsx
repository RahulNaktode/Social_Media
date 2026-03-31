import Friend from '../../components/Friend.jsx';
import { getUserJwtToken, getUserData } from './../../utils.jsx';
import axios from 'axios';
import HeartImg from './../../assets/heart.png';
import DisHeartImg from '../../assets/disheart.png';
import { MessageSquareText, Share2 } from 'lucide-react';
import { useState } from 'react';

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
    <div className='border border-gray-300 shadow px-5 py-6 w-160 mt-5'>
      <div>
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        <p className='text-gray-500 mt-4 mx-3'>{description}</p>
        <div className='flex items-center gap-2'>
          {picturePath &&
            (<img src={picturePath} alt="Post" className=' h-full rounded mt-2 mx-2' />)
          }
        </div>
        <div className='flex items-center justify-between gap-4 mt-5'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1'>
              {isLiked ? (
                <div>
                  <img src={HeartImg} alt="Liked" onClick={patchLike} className='cursor-pointer w-6 h-6' />
                </div>
              ) : (
                <div>
                  <img src={DisHeartImg} alt="Not Liked" onClick={patchLike} className='cursor-pointer w-6 h-6' />
                </div>
              )}
              <span>{likesCount} {likesCount === 1 ? "like" : "likes"}</span>
            </div>

            <div className='flex items-center gap-1 cursor-pointer' >

              <MessageSquareText onClick={() => setIsComments(!isComments)} /><span>{comments.length}</span>
              <div>
                {isComments && (
                  <div className='mt-3'>
                    {comments.map((comment, index) => (
                      <div key={`${name}-${index}`} className='mb-2'>
                        <p className='text-gray-700'>{comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <Share2 />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostWidget
