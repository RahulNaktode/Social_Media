import axios from 'axios';
import { getUserJwtToken, getUserData } from '../../utils';
import { useState, useEffect } from 'react';
import PostWidget from './PostWidget';

function PostsWidget({ isProfile = false }) {
    const [posts, setPosts] = useState([]);
    const userId = getUserData()?._id;
    const getPosts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/posts", {
                headers: {
                    Authorization: `Bearer ${getUserJwtToken()}`
                }
            });
            setPosts(response.data.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }

    }

    const getUserPosts = async () => {
        const response = await axios.get(`http://localhost:8080/posts/${userId}/posts`, {
            headers: {
                Authorization: `Bearer ${getUserJwtToken()}`
            }
        })
        if (response.data.success) {
            setPosts(response.data.data);
        } else {
            console.log("No posts found");
        }
    }

    useEffect(() => {
        if (isProfile && userId) {
            getUserPosts();
        } else {
            getPosts();
        }
    }, [isProfile, userId]);



    return (
        <div>
            <div>{posts.map((post) => (
                <PostWidget
                    key={post._id}
                    postId={post._id}
                    postUserId={post.userId}
                    name={`${post.firstName} ${post.lastName}`}
                    description={post.description}
                    location={post.location}
                    picturePath={post.picturePath?.[0]}
                    userPicturePath={post.userPhotos?.[0]}
                    likes={post.likes || {}}
                    comments={post.comments || []}
                />
            )
            )}</div>
        </div>
    )
}

export default PostsWidget
