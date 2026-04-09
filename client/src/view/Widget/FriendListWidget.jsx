import { useState, useEffect } from 'react'
import { getUserData, getUserJwtToken } from '../../utils';
import Friend from '../../components/Friend';
import axios from 'axios';

function FriendListWidget() {
    const [friends, setFriends] = useState([]);
    const userId = getUserData()?._id;

    const getFriends = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/${userId}/friends`, {
                headers: { Authorization: `Bearer ${getUserJwtToken()}` },
            });
            console.log("Friends list response:", response.data);
            if (response.data.success) {
                setFriends(response.data.data);
            } else {
                console.error("Failed to fetch friends:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    }

    useEffect(() => {
        getFriends();                  
    }, []);


  return (
    <div className='border border-gray-300 shadow px-5 py-6 w-80 mt-5'>
      <h1 className='text-xl font-bold'>Friends List</h1>
      <div className='gap-2'>
        {friends.map((friend) => (
            <Friend 
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.userPicturePath}
            />
        ))}
      </div>
    </div>
  )
}

export default FriendListWidget
