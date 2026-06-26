import express from 'express';

import { addPG, getPG, getPGsByOwner, updateRooms } from '../controllers/pgController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router=express.Router();

router.post('/add',protect,upload.array("images",5),addPG);

router.get('/',getPG);

router.get('/owner/:userId', getPGsByOwner);

router.put('/rooms/:id',protect,updateRooms);

export default router;