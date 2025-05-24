import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import mongoose from 'mongoose'

const createComment= asyncHandler(async(req, res) => {
    const {content} = req.body;

    if(content === ""){
        throw new ApiError(401, "Content is required!")
    }


    const comment  = await Comment.create({
        content,
        owner:req.user._id
    })
    if(!comment){
        throw new ApiError(500, "Something went wrong while creating the comment")
    }
    return res.status(201).json(
        new ApiResponse(200, comment, "Comment created successfully")
    )  
})

const addCommentInComment = asyncHandler(async (req, res) => {
    const {commentId,AddcommentId} = req.body;
    if(!commentId || !AddcommentId){
      throw new ApiError(4001, "CommentId is required!")
    }

    const comment = await Comment.findByIdAndUpdate(commentId, {
      $push:{
        comment:AddcommentId
      }
    })

    if(!comment){
      throw new ApiError(401, "Comment is not able to Added")
    }

    return res.status(200)
      .json(new ApiResponse(
        200,
        comment,
        "Comment Added Successfully"
      ))

})

const getAllCommentOfComment = asyncHandler(async(req, res) => {
    const {commentId} = req.body;
    if(!commentId){
        throw new ApiError(401, "commentId is required!")
    }

    const comment = await Comment.aggregate(
        [
            {
              $match: {
                _id: new mongoose.Types.ObjectId(commentId)
              }
            },
            {
              $lookup: {
                from: "comments",
                localField: "comment",
                foreignField: "_id",
                as: "comment_Detail",
                pipeline:[
                  {
                    $lookup:{
                      from: "users",
                      localField: "owner",
                      foreignField: "_id",
                      as: "user_Detail",
                      pipeline:[
                        {
                          $project:{
                            username:1,
                            avatar:1
                          }
                        }
                      ]
                    }
                  },
                  {
                    $project:{
                      content:1,
                      likeCount:1,
                      user_Detail:1,
                      comment:1,
                      updatedAt:1
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
        "Solution fetched successfully"
    ))
})


export {
    createComment,
    addCommentInComment,
    getAllCommentOfComment
}