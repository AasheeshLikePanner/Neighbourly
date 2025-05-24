import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const genrateAccessTokenAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.genreateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while genrating refresh and acess token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    console.log('i am working here');
    const {fullName, username, email, password} = req.body;

    if(
        [fullName, username, password, email].some((f) => f?.trim() === "") 
    ){
        throw new ApiError(400, "All feilds are required")
    }
    console.log("Worked Till level 1");

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    console.log("Worked Till level 2");

    if(existedUser){
        throw new ApiError(409, "User with email or username already exist");
    }

    const avatarBuffer = req.file?.buffer;

    if(!avatarBuffer){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarBuffer);

    console.log(avatar);

    await User.create({
        fullName,
        avatar: avatar.url,
        email, 
        password,
        username: username.toLowerCase()
    })

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404, "User signup Failed");
    }
    const isPassowrdValid = await user.isPasswordCorrect(password);

    if(!isPassowrdValid){
        throw new ApiError(401, "Password is incorect!")
    }
    const {accessToken, refreshToken} = await genrateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        Secure:true,
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, {httpOnly: true, secure: false, sameSite: "lax"})
    .cookie("refreshToken", refreshToken, {httpOnly: true, secure: false, sameSite: "lax"})
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);
    

    if(!email && !password){
        throw new ApiError(400, "email or password is required")
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404, "User does not exist")
    }
    const isPassowrdValid = await user.isPasswordCorrect(password);

    if(!isPassowrdValid){
        throw new ApiError(401, "Password is incorect!")
    }
    const {accessToken, refreshToken} = await genrateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        Secure:true,
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, {httpOnly: true, secure: false, sameSite: "lax"})
    .cookie("refreshToken", refreshToken, {httpOnly: true, secure: false, sameSite: "lax"})
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})


const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unAuthorized request")
    }

    try{
        const decodedToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await user.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
        const options = {
            httpOnly: true,
            Secure:true,
            sameSite: 'none'
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    }catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const getCurrentUser = asyncHandler(async(req,res) => {
    const r = req.user;
    return  res
    .status(200)
    .json(new ApiResponse(
        200,
        r,
        "User fetched successfully"
    ))
})
    
const addPostToHistory = asyncHandler(async (req, res) => {
    const { solutionId} = req.body; 
    const userId = req.user._id;
    console.log(userId);
    if(!userId || !solutionId){
        throw new ApiError(200, "userId and soltionId required!")
    }

    const user = await User.findByIdAndUpdate(userId, {
        $push:{
            post:solutionId
        }
    })

    if(!user){
        throw new ApiError(200, "Some Problem While Adding Solution to user submissions")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "Solution added to user Submission  successfully"
    ))
})

const getPostHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(400, "userId is required!");
    }

    const userArchive = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: 'posts',
                localField: 'submission',
                foreignField: '_id',
                as: 'posts',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'userDetail'
                        }
                    },
                    {
                        $project: {
                            'userDetail.username': 1,
                            'userDetail.avatar': 1,
                            'userDetail.fullName': 1,
                            title: 1,
                            content: 1,
                            link: 1,
                            likeCount: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                solutions: 1,
            }
        }
    ]);

    if (!userArchive) {
        throw new ApiError(500, "Something went wrong while getting user submissions");
    }

    return res.status(200).json(new ApiResponse(
        200,
        userArchive,
        "User submission fetched successfully"
    ));
});

const getUser = asyncHandler(async (req, res) => {
    const {userId} = req.body;

    const r = await User.findById(userId)
    if(!r){
        throw new ApiError(404, "User not found")
    }

    return  res
    .status(200)
    .json(new ApiResponse(
        200,
        r,
        "User fetched successfully"
    ))
})


export {
    registerUser,
    loginUser,
    refreshAccessToken,
    getCurrentUser,
    addPostToHistory,
    getPostHistory,
    getUser
}