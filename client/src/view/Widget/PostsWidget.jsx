import axios from 'axios';
import { getUserJwtToken } from '../../utils';
import { useState, useEffect } from 'react';
import PostWidget from './PostWidget';

function PostsWidget({ isProfile = false, userId }) { // ✅ Props se userId lo
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
                headers: { Authorization: `Bearer ${getUserJwtToken()}` }
            });
            setPosts(response.data.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    const getUserPosts = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/post/${userId}/posts`, {
            headers: { Authorization: `Bearer ${getUserJwtToken()}` }
        });
        if (response.data.success) {
            setPosts(response.data.data);
        }
    }

    useEffect(() => {
        if (isProfile && userId) {
            getUserPosts();
        } else {
            getPosts();
        }
    }, [isProfile, userId]); // ✅ userId change hone par refetch karo

    return (
        <div>
        {posts.map((post) => {
            // ✅ populate ki wajah se user data post.userId mein hai
            const postUser = post.userId;

            return (
                <PostWidget
                    key={post._id}
                    postId={post._id}
                    postUserId={postUser?._id || post.userId}
                    name={`${postUser?.firstName || post.firstName} ${postUser?.lastName || post.lastName}`}
                    description={post.description}
                    location={postUser?.location || post.location}
                    picturePath={post.picturePath?.[0] || post.picturePath}
                    userPicturePath={postUser?.photos?.[0] || post.userPhotos?.[0]}
                    likes={post.likes || {}}
                    comments={post.comments || []}
                />
            );
        })}
    </div>
    
    )
}

export default PostsWidget