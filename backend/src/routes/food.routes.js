import express from 'express';
import { listFood } from '../controllers/food.controller.js';
import { authFoodPartner } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
})

export const foodRouter = express.Router()

foodRouter.post("/", authFoodPartner, upload.single("video"), listFood)