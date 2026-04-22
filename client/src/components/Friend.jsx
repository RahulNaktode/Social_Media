import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUserJwtToken, getUserData } from './../utils.jsx';
import axios from 'axios';
import Avatar from './Avatar.jsx';
import { UserPlus, UserMinus } from 'lucide-react';

function Friend({ friendId, name, subtitle, userPicturePath, onFriendUpdate }) {
    const user = getUserData();
    const userId = user?._id;
    const navigate = useNavigate();

    const [friendsList, setFriendsList] = useState([]);

    const isFriend = friendsList?.some((f) => {
        const compareId = typeof f === 'object' ? f._id : f;
        return String(compareId) === String(friendId);
    });

    const patchFriend = async () => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/user/${userId}/${friendId}`,
                {},
                { headers: { Authorization: `Bearer ${getUserJwtToken()}` } }
            );

            setFriendsList(response.data.data);

            if (onFriendUpdate) {
                onFriendUpdate();
            }
        } catch (err) {
            console.error("Error updating friend:", err);
        }
    }

    useEffect(() => {
        if (!userId) return;
        const getUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/${userId}`, {
                    headers: { Authorization: `Bearer ${getUserJwtToken()}` }
                });
                setFriendsList(res.data.data?.friends || []);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        getUser();
    }, [userId]);

    return (
        <div className='flex items-center justify-between p-2'>
            <div
                className='flex gap-3 items-center cursor-pointer'
                onClick={() => navigate(`/profile/${friendId}`)}
            >
                {userPicturePath ? (
                    <img
                        src={userPicturePath}
                        alt={name}
                        className="w-11 h-11 rounded-full object-cover"
                    />
                ) : (
                    <Avatar name={name} />
                )}
                <div>
                    <div className='font-bold text-lg hover:scale-110 transition-transform'>{name}</div>
                    <div className='text-gray-500 text-sm'>{subtitle}</div>
                </div>
            </div>

            <button
                onClick={patchFriend}
                className={`p-2 rounded-full hover:scale-110 transition-transform cursor-pointer ${isFriend ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}
            >
                {isFriend ? <UserMinus size={22} /> : <UserPlus size={22} />}
            </button>
        </div>
    );
}

export default Friend;