import { useState, useEffect } from 'react'
import { getUserJwtToken } from '../../utils';
import Friend from '../../components/Friend';
import axios from 'axios';

function FriendListWidget({ userId }) {
    const [friends, setFriends] = useState([]);

    const getFriends = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/${userId}/friends`, {
                headers: { Authorization: `Bearer ${getUserJwtToken()}` },
            });
            if (response.data.success) {
                setFriends(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    }

    useEffect(() => {
        if (userId) getFriends();
    }, [userId]);

    return (
        <div className='border border-gray-300 shadow px-5 py-6 w-80 mt-5'>
            <h1 className='text-xl font-bold'>Friends List</h1>
            <div className='gap-2'>
                {friends.length === 0 ? (
                    <p className='text-gray-400 text-sm mt-2'>No friends yet</p>
                ) : (
                    friends.map((friend) => (
                        <Friend
                            key={friend._id}
                            friendId={friend._id}
                            name={`${friend.firstName} ${friend.lastName}`}
                            subtitle={friend.occupation}
                            userPicturePath={friend.userPicturePath}
                            onFriendUpdate={getFriends} // ✅ refresh callback pass karo
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default FriendListWidget