import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const createPost = asyncHandler(async (req, res) => {
    const { content, type, state } = req.body;
    console.log(link, content, title);

    if ([type, content].some((field) => field?.trim() === "")) {
        throw new ApiError(401, "All fields are required");
    }
    const imageBuffer = req.file?.Buffer;
    var image;
    if (imageBuffer) {
        image = await uploadOnCloudinary(imageBuffer)
    }

    const Post = await Post.create({
        image,
        content,
        type,
        state,
        owner: req.user._id
    })
    if (!Post) {
        throw new ApiError(500, "Something went wrong while creating the Post")
    }


    return res.status(201).json(
        new ApiResponse(200, Post, "Post created successfully")
    )
})


const AddCommentInPost = asyncHandler(async (req, res) => {
    const { PostId, commentId } = req.body;

    if (!PostId || !commentId) {
        throw new ApiError(401, "Something went wrong while creating adding comment to Post")
    }

    try {
        const Post = await Post.findByIdAndUpdate(
            PostId,
            {
                $push: {
                    comment: commentId
                }
            }
        )
        console.log(PostId);
        return res.status(200)
            .json(
                new ApiResponse(200, Post, "Comment added successfully")
            )
    } catch (error) {
        return res.status(401)
            .json(
                new ApiError(401, "Error while adding the comment to the Post")
            )
    }
})

const getPost = asyncHandler(async (req, res) => {
    const { PostId } = req.body;
    const Post = await Post.aggregate(
        [
            {
                $match:
                {
                    _id: new mongoose.Types.ObjectId(PostId),
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: "userDetails",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                avatar: 1,
                                fullName: 1,
                            }
                        }
                    ]
                }
            }
        ]
    )
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            Post,
            "Post fetched successfully"
        ))
})

const getPosts = asyncHandler(async (req, res) => {
    const {state, filterType} = req.body;
    if(filterType === 'nearby'){

    }else if (filterType === 'trending'){

    }else if (filterType === 'new'){

    }else if (filterType === 'top'){
        
    }
})

const getAllCommentOfPost = asyncHandler(async (req, res) => {
    const { PostId } = req.body;
    console.log(PostId);
    const comment = await Post.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(PostId)
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "comment",
                    foreignField: "_id",
                    as: "comment_Detail",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "user_Detail",
                                pipeline: [
                                    {
                                        $project: {
                                            username: 1,
                                            avatar: 1

                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                content: 1,
                                likeCount: 1,
                                user_Detail: 1,
                                comment: 1,
                                updatedAt: 1
                            }
                        }
                    ]
                }
            }
        ]
    )
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            comment,
            "Comment fetch Succefully fetched successfully"
        ))
})


export {
    createPost,
    AddCommentInPost,
    getPost,
    getAllCommentOfPost,
}