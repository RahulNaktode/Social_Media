import Post from "../models/Post.js";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

const createPost = async (req, res) => {
    try{
        const {userId, description, picturePath} = req.body;
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
            location: user.location,
            description,
            userPhotos: user.photos,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();

        const posts = await Post.find().populate("userId");
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
        const posts = await Post.find().populate("userId");   
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
        const post = await Post.find({ userId }).populate("userId");
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
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const post = await Post.findById(id);

        if (!post) {
            return res.json({
                success: false,
                message: "Post not found",
                data: null
            });
        }

        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        await post.save();

        return res.json({
            success: true,
            message: "Post liked successfully",
            data: {
                ...post._doc,
                likes: Object.fromEntries(post.likes)
            }
        });

    } catch (error) {
        return res.json({
            success: false,
            message: `Error liking post: ${error.message}`,
            data: null
        });
    }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params; // Post ID URL se milegi
    const { comment } = req.body; // Comment text body se milega

    // Post dhund kar uske comments array mein naya comment add karein
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: comment } }, // MongoDB $push operator ka use karein
      { new: true } // Taaki update hone ke baad naya data return ho
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ 
        message: "Comment added successfully", 
        data: updatedPost 
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export { createPost, getFeedPosts, getUserPosts, likePost, addComment }