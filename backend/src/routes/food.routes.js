import express from 'express';
import { listFood } from '../controllers/food.controller.js';
import { authFoodPartner } from '../middlewares/auth.middleware.js';

export const foodRouter = express.Router()

foodRouter.post("/list-food", authFoodPartner, listFood)