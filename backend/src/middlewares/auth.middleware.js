import { FoodPartner } from "../models/foodPartner.model.js";
import jwt from "jsonwebtoken";

export const authFoodPartner = async (req, res, next) => {
  try {
    // 1. Check for token
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find food partner
    const foodPartner = await FoodPartner.findById(decoded.id).select(
      "-password"
    ); // exclude password

    if (!foodPartner) {
      return res.status(404).json({ message: "Food Partner not found" });
    }

    // 4. Attach to request
    req.foodPartner = foodPartner;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};
