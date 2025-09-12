import express from 'express';
import { getFoodPartnerById } from '../controllers/food-partner.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';


 export const foodPartnerRouter = express.Router();

foodPartnerRouter.get("/:id", authUser, getFoodPartnerById);
