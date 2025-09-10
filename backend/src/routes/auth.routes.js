import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
} from "../controllers/auth.controller.js";

export const foodRouter = express.Router();

foodRouter.post("/user/register", registerUser);
foodRouter.post("/user/login", loginUser);
foodRouter.get("/user/logout", logoutUser);

foodRouter.post("/food-partner/register", registerFoodPartner);
foodRouter.post("/food-partner/login", loginFoodPartner);
foodRouter.get("/food-partner/logout", logoutFoodPartner);
