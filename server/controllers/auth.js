import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const postRegister = async (req, res) => {
    const { firstName, lastName, email, password,photos, friends, location,  occupation } = req.body;

    if(!firstName){
        return res.json({
            success: false,
            message: "First name is required",
            data: null
        })
    }

    if(!lastName){
        return res.json({
            success: false,
            message: "Last name is required",
            data: null
        })
    }

    if(!email){
        return res.json({
            success: false,
            message: "Email is required",
            data: null
        })
    }

    if(!password){
        return res.json({
            success: false,
            message: "Password is required",
            data: null
        })
    }

    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.json({
            success: false,
            message: "User already exists",
            data: null
        })
    }

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
        photos,
        friends,
        location: location || "",
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000)
    })

    try{
        const savedUser = await newUser.save();
        return res.json({
            success: true,
            message: "User registered successfully",
            data: savedUser
        })
    } catch(error){
        return res.json({
            success: false,
            message: `User Registered failed: ${error.message}`,
            data: null
        })
    }
}

const postLogin = async (req, res) => {
    const { email, password } = req.body;

    if(!email){
        return res.json({
            success: false,
            message: "Email is required",
            data: null
        })
    }

    if(!password){
        return res.json({
            success: false,
            message: "Password is required",
            data: null
        })
    }

    const existingUser = await User.findOne({email});

    if(!existingUser){
        return res.json({
            success: false,
            message: "User does not exist, please register",
            data: null
        })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    existingUser.password = undefined;

    const jwtToken = jwt.sign(
        { 
            id: existingUser._id
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: "1d" 
        }
    )

    if(isPasswordCorrect){
        return res.json({
            success: true,
            message: "User logged in successfully",
            data: existingUser,
            jwtToken: jwtToken
        })
    }else{
        return res.json({
            success: false,
            message: "Invalid Username or Password",
            data: null
        })
    }

}

export { postRegister, postLogin }