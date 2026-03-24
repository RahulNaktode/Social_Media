import mongoose, { Schema, model } from "mongoose";

const userSchema =new Schema({
    firstName:{
        type: String,
        required: true,
        min: 3,
        max:20
    },

    lastName: {
        type: String,
        required: true,
        min: 3,
        max:20
    },

    email: {
        type: String,
        required: true,
        unique: true,
        max: 30
    },

    password: {
        type: String,
        required: true,
        min: 6
    },

    photos: {
        type: [String],
        default: []
    },

    friends: {
        type: Array,
        default: []
    },

    location: {
        type: String,
    },

    occupation: {
        type: String,
    },

    viewedProfile: {
        type: Number
    },

    impressions: {
        type: Number
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

export default User;