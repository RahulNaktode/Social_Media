import mongoose, { Schema, model } from "mongoose";

const postSchema = new Schema({
    userId:{
        type: String,
        required: true
    },

    firstName:{
        type: String,
        required: true
    },

    lastName:{
        type: String,
        required: true
    },

    location: {
        type: String,
    },

    description: {
        type: String,
    },

    photos: {
        type: [String],
        default: []
    },

    userPhotos: {
        type: [String],
        default: []
    },

    likes: {
        type: Map,
        of: Boolean
    },

    comments: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;