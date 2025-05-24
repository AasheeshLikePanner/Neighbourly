import Router from 'express'
import { likeItem, unLikeItem } from '../controllers/like.controller.js';

const router = Router();

router.route('/like-item').post(likeItem)

router.route('/unlike-item').post(unLikeItem)

export default router;