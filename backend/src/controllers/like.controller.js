import { Post } from '../models/post.model.js'
import { Comment } from '../models/comment.model.js'
import { Like } from '../models/like.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import mongoose from 'mongoose'

const likeItem = asyncHandler(async (req, res) => {
    const { itemId, itemType } = req.body;
    console.log( itemId, itemType);
    try {
        const like = await Like.create({ user: req.user._id, item: itemId, itemType });

        let updatedItem;

        if (itemType === 'Post') {
            updatedItem = await Post.findByIdAndUpdate(
                itemId,
                { $inc: { likeCount: 1 } },
                { new: true }
            );
        } else {
            updatedItem = await Comment.findByIdAndUpdate(
                itemId,
                { $inc: { likeCount: 1 } },
                { new: true }
            );
        }

        if (!updatedItem) {
            throw new ApiError(404, `${itemType} not found`);
        }

        return res.status(201).json(
            new ApiResponse(200, updatedItem, `${itemType} liked successfully`)
        );
    } catch (error) {
        console.error('Error while liking the item:', error);
        throw new ApiError(400, "Error while liking the item", error.message);
    }
});

const unLikeItem = asyncHandler(async (req, res) => {
    const { itemId, itemType } = req.body;
    const result = await Like.findOneAndDelete({ user: req.user._id, item: itemId, itemType });

    if (result) {
        if (itemType === 'Comment') {
            const comment = await Comment.findByIdAndUpdate(itemId, { $inc: { likeCount: -1 } });
            return res.status(201).json(
                new ApiResponse(200, comment, "Comment UnLiked  successfully")
            )
        } else {
            const solution = await Post.findByIdAndUpdate(itemId, { $inc: { likeCount: -1 } });
            return res.status(201).json(
                new ApiResponse(200, solution, "Solution UnLiked  successfully")
            )
        }
    }
})

const getUserLikes = asyncHandler(async (req, res) => {
    const { userId, itemType } = req.body;

    if ([userId, itemType].some((f) => f?.trim() === "")) {
        throw new ApiError(400, "User Id not able or itemType not able to find");
    }
    var userLikes;
    if (itemType === 'Post') {
        userLikes = await Like.find({ user: userId, itemType: 'Post' });
    } else {
        userLikes = await Like.find({ user: userId, itemType: 'Comment' });
    }
    return res.status(200).json(
        new ApiResponse(200, userLikes, "User Likes fetched succesfully!!!")
    )
})

export {
    unLikeItem,
    likeItem,
    getUserLikes
}