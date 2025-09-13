import express from "express";
import { getFood, likeFood, listFood, saveFood } from "../controllers/food.controller.js";
import { authFoodPartner, authUser } from "../middlewares/auth.middleware.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

export const foodRouter = express.Router();

// protected route for uploading food items (only partners)
foodRouter.post("/", authFoodPartner, upload.single("video"), listFood);

// protected route for getting food items (either user or partner)
foodRouter.get(
  "/",
  (req, res, next) => {
    // run user auth → if fails, try partner auth
    authUser(req, res, (err) => {
      if (!err && req.user) return next(); // user authenticated
      authFoodPartner(req, res, (err2) => {
        if (!err2 && req.foodPartner) return next(); // partner authenticated
        return res.status(401).json({ message: "Unauthorized" });
      });
    });
  },
  getFood
);

// protected route for like foods (only users)
foodRouter.post("/like", authUser, likeFood);

// protected route for save foods (only users)
foodRouter.post("/save", authUser, saveFood);
