import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const getUser = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);

        if(!user){
            return res.json({
                success: false,
                message: "User not found",
                data: null
            })
        }
        return res.json({
            success: true,
            message: "User found",
            data: user
        })
    }catch(error){
        return res.json({
            success: false,
            message: `Error fetching user: ${error.message}`,
            data: null
        })
    }
}

const getUserFriends = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map(friendId => User.findById(friendId))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, photos }) => {
                return { _id, firstName, lastName, occupation, location, photos }
            }
        );

        return res.json({
            success: true,
            message: "Friends fetched successfully",
            data: formattedFriends
        });
    }catch(error){
        return res.json({
            success: false,
            message: `Error fetching friends: ${error.message}`,
            data: null
        });
    };
}

const addRemoveFriends = async (req, res) => {
    try{
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter(id => id !== friendId);
            friend.friends = friend.friends.filter(id => id !== id);
        }else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map(friendId => User.findById(friendId))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, photos }) => {
                return { _id, firstName, lastName, occupation, location, photos }
            }
        );

        return res.json({
            success: true,
            message: "Friend added/removed successfully",
            data: formattedFriends
        });
        
    }catch(error){
        return res.json({
            success: false,
            message: `Error adding/removing friend: ${error.message}`,
            data: null
        });
    }

}

export { getUser, getUserFriends, addRemoveFriends }