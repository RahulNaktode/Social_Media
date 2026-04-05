import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("friends");

        if (!user) {
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
    } catch (error) {
        return res.json({
            success: false,
            message: `Error fetching user: ${error.message}`,
            data: null
        })
    }
}

const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map(friendId => User.findById(friendId))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, photos }) => {
                return {
                    _id,
                    firstName,
                    lastName,
                    occupation,
                    location,
                    userPicturePath: photos?.[0]
                }
            }
        );

        return res.json({
            success: true,
            message: "Friends fetched successfully",
            data: formattedFriends
        });
    } catch (error) {
        return res.json({
            success: false,
            message: `Error fetching friends: ${error.message}`,
            data: null
        });
    };
}

const updateUser = async (req, res) => {
  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { firstName, lastName, email, photos, location, occupation } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, photos, location, occupation },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
};


const addRemoveFriends = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            // Remove from both
            await User.findByIdAndUpdate(id, { $pull: { friends: friendId } });
            await User.findByIdAndUpdate(friendId, { $pull: { friends: id } });
        } else {
            // Add to both
            await User.findByIdAndUpdate(id, { $push: { friends: friendId } });
            await User.findByIdAndUpdate(friendId, { $push: { friends: id } });
        }


        const updatedUser = await User.findById(id).populate("friends");

        const formattedFriends = updatedUser.friends.map(
            ({ _id, firstName, lastName, occupation, location, photos }) => {
                return { _id, firstName, lastName, occupation, location, photos };
            }
        );

        return res.json({
            success: true,
            message: "Friend added/removed successfully",
            data: formattedFriends
        });

    } catch (error) {
        return res.json({
            success: false,
            message: `Error adding/removing friend: ${error.message}`,
            data: null
        });
    }

}

export { getUser, getUserFriends, addRemoveFriends, updateUser };