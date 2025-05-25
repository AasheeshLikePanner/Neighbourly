import Router from 'express'
import { likeItem, unLikeItem, getUserLikes } from '../controllers/like.controller.js';

const router = Router();

router.route('/like').post(likeItem)

router.route('/unlike').post(unLikeItem)

router.route('/userlikes').post(getUserLikes)

export default router;