import Post from "../models/Post.js";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

const createPost = async (req, res) => {
    try{
        const {userId, description, photos} = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.json({
                success: false,
                message: "User not found",
                data: null
            })
        }

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            description,
            userPhotos: user.photos,
            photos,
            likes: {},
            comments: []
        })
        await newPost.save();

        const posts = await Post.find();
        return res.json({
            success: true,
            message: "Post created successfully",
            data: posts
        })
    }catch(error){
        return res.json({
            success: false,
            message: `Error creating post: ${error.message}`,
            data: null
        })
    }
}

const getFeedPosts = async (req, res) => {
    try{
        const posts = await Post.find();   
        return res.json({
            success: true,
            message: "Posts fetched successfully",
            data: posts
        })
    }catch(error){
        return res.json({
            success: false,
            message: `Error fetching posts: ${error.message}`,
            data: null
        })
    }
}

const getUserPosts = async (req, res) => {
    try{
        const { userId } = req.params;
        const post = await Post.find({ userId });
        return res.json({
            success: true,
            message: "User posts fetched successfully",
            data: post
        })
    }catch(error){
        return res.json({
            success: false,
            message: `Error fetching user posts: ${error.message}`,
            data: null
        })
    }
}

const likePost = async (req, res) => {
    try{
        const { id} = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        );

        return res.json({
            success: true,
            message: "Post liked successfully",
            data: updatedPost
        })
    }catch(error){
        return res.json({
            success: false,
            message: `Error liking post: ${error.message}`,
            data: null
        })
    }
}

export { createPost, getFeedPosts, getUserPosts, likePost }