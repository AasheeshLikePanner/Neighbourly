import {Post} from '../models/post.model.js'
import {Comment} from '../models/comment.model.js'
import {Like} from '../models/like.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
import mongoose from 'mongoose'

const likeItem = asyncHandler(async (req, res) => {
    const { userId, itemId, itemType } = req.body;
    console.log(userId, itemId, itemType);
    try {
        const likeExist = await Like.findOne({
            user: new mongoose.Types.ObjectId(userId),
            itemType: itemType,
            item: new mongoose.Types.ObjectId(itemId)
        });


        if (likeExist) {
            throw new ApiError(500, "User already liked the item");
        }
        const like = await Like.create({ user: userId, item: itemId, itemType });

        let updatedItem;

        if (itemType === 'post') {
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

const unLikeItem = asyncHandler(async(req, res) => {
    const {userId, itemId, itemType} = req.body; 
    const result = await Like.findOneAndDelete({ user: userId, item: itemId, itemType });

        if (result) {
            if (itemType === 'comment') {
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

export{
    unLikeItem,
    likeItem
}