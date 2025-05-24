import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AddCommentInPost, createPost, getPosts, getAllCommentOfPost, getPost } from "../controllers/post.controller.js";

const router = Router()

router.route('/create-post').post(verifyJWT , createPost)

router.route('/add-comment-post').post(verifyJWT, AddCommentInPost)

router.route('/posts').post(getPosts)

router.route('/comments').post(getAllCommentOfPost)


export default router;