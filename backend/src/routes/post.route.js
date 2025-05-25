import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AddCommentInPost, createPost, getPosts, getAllCommentOfPost, getPost } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/create').post(verifyJWT , upload.single('image'),createPost)

router.route('/add-comment-post').post(verifyJWT, AddCommentInPost)

router.route('/posts').post(getPosts)

router.route('/post').post(getPost)

router.route('/comments').post(getAllCommentOfPost)


export default router;