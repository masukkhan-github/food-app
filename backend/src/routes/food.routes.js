import express from "express";
import { getFood, listFood } from "../controllers/food.controller.js";
import { authFoodPartner, authUser } from "../middlewares/auth.middleware.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

export const foodRouter = express.Router();

//protected route for uploading food items
foodRouter.post("/", authFoodPartner, upload.single("video"), listFood);

//protected route for getting food items
foodRouter.get("/", authUser, getFood)
