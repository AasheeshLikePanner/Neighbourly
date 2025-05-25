import Router from 'express'
import { createComment, getAllCommentOfComment, addCommentInComment } from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/create').post(verifyJWT , createComment);

router.route('/add-comment').post(verifyJWT ,addCommentInComment)

router.route('/get-allcomment-ofcomment').post(getAllCommentOfComment)

export default router;