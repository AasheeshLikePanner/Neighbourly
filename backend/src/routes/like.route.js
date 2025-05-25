import Router from 'express'
import { likeItem, unLikeItem } from '../controllers/like.controller.js';

const router = Router();

router.route('/like').post(likeItem)

router.route('/unlike').post(unLikeItem)

export default router;