import Router from 'express'
import { likeItem, unLikeItem, getUserLikes } from '../controllers/like.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { version } from 'mongoose';

const router = Router();

router.route('/like').post(verifyJWT,likeItem)

router.route('/unlike').post( verifyJWT,unLikeItem)

router.route('/userlikes').post(verifyJWT,getUserLikes)

export default router;