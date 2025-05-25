import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const createPost = asyncHandler(async (req, res) => {

    const { city, content, type, latitude, longitude } = req.body;

    if ([type, content].some((field) => field?.trim() === "")) {
        throw new ApiError(401, "All fields are required");
    }

    let image;
    const imageBuffer = req.file;
    console.log(req.file);
    if (imageBuffer) {
        image = await uploadOnCloudinary(imageBuffer.buffer);
        console.log(image);
        
    }

    const newPost = await Post.create({
        image:image.url,
        content,
        city,
        type,
        owner: req.user._id,
        location: latitude && longitude
            ? {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            }
            : undefined
    });
    console.log('post created successful')
    if (!newPost) {
        throw new ApiError(500, "Something went wrong while creating the Post");
    }

    return res.status(201).json(
        new ApiResponse(200, newPost, "Post created successfully")
    );
});

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
    const { postId } = req.body;
    const fetchedPost = await Post.aggregate(
        [
            {
                $match:
                {
                    _id: new mongoose.Types.ObjectId(postId),
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
            fetchedPost[0],
            "Post fetched successfully"
        ))
})

const getPosts = asyncHandler(async (req, res) => {
    console.log(req.body);

    const { filterType, latitude, longitude } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    let sort = {};
    let aggregatePipeline = [];

    switch (filterType) {
        case 'new':
            sort = { createdAt: -1 };
            break;

        case 'trending':
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            query = {
                createdAt: { $gte: sevenDaysAgo }
            };
            sort = { likeCount: -1, createdAt: -1 };
            break;

        case 'top':
            // Top all time by likeCount
            sort = { likeCount: -1 };
            break;

        case 'nearby':
            // Nearby requires coordinates
            if (!latitude || !longitude) {
                return res.status(400).json({ message: "Latitude and Longitude required for nearby filter" });
            }
            // Assuming you add a 'location' field in your schema with GeoJSON format
            // If you don't have location in schema, you cannot do geo queries
            aggregatePipeline = [
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                        distanceField: "distance",
                        maxDistance: 20000, // 10 km radius, adjust as needed
                        spherical: true,
                        query: {}
                    }
                },
                { $sort: { distance: 1, createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner"
                    }
                },
                { $unwind: "$owner" },
                {
                    $project: {
                        image: 1,
                        content: 1,
                        type: 1,
                        city: 1,
                        likeCount: 1,
                        createdAt: 1,
                        owner: { username: 1, avatar: 1, fullName: 1 },
                        distance: 1,
                        commentCount: { $size: "$comment" }
                    }
                }
            ];

            const nearbyPosts = await Post.aggregate(aggregatePipeline);
            return res.status(200).json({
                page,
                limit,
                count: nearbyPosts.length,
                posts: nearbyPosts
            });

        default:
            return res.status(400).json({ message: "Invalid filterType" });
    }

    // For filters other than nearby, simple mongoose query with pagination
    const posts = await Post.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('owner', 'username avatar fullName')
        .lean();

    // Add comment count for each post (optional but useful)
    // Since you have comment array in post, just count length
    const postsWithCommentCount = posts.map(post => ({
        ...post,
        commentCount: post.comment.length
    }));

    const totalPosts = await Post.countDocuments(query);

    return res.status(200).json({
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        posts: postsWithCommentCount
    });
});


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
    getPosts,
    getAllCommentOfPost,
    getPost
}