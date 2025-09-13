import { Like } from "../models/like.model.js";
import { Save } from "../models/save.model.js";
import { uploadFile } from "../services/storage.service.js";
import { v4 as uuid } from "uuid";

export const listFood = async (req, res) => {
  try {
    const { name, description } = req.body;
    const fileUploadResult = await uploadFile(req.file.buffer, uuid());

    const foodItem = await Food.create({
      name: name,
      video: fileUploadResult.url,
      description: description,
      foodPartner: req.foodPartner._id,
    });

    res.status(201).json({ message: "Food item created", foodItem: foodItem });
  } catch (error) {
    console.error("Error creating food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFood = async (req, res) => {
  try {
    const foodItem = await Food.find({});
    res.status(200).json({
      message: "Food item fetched successfully",
      foodItem: foodItem,
    });
  } catch (error) {
    console.error("Error getting food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const likeFood = async (req, res) => {
  const { foodId } = req.body;
  const user = req.user;

  try {
    const isLiked = await Like.findOne({
      user: user._id,
      food: foodId,
    });

    if (isLiked) {
      await Like.deleteOne({
        user: user._id,
        food: foodId,
      });

      await Food.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 },
      });
      return res.status(200).json({ message: "food unLiked successfully" });
    }

    const like = await Like.create({
      user: user._id,
      food: foodId,
    });

    await Food.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });
    res.status(201).json({ message: "food liked successfully", like });
  } catch (error) {
    console.error("Error liking food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const saveFood = async (req, res) => {
  const { foodId } = req.body;
  const user = req.user;
  try {
    const existingSave = await Save.findOne({
      user: user._id,
      food: foodId,
    });

    if (existingSave) {
      await Save.deleteOne({
        user: user._id,
        food: foodId,
      });
      return res.status(200).json({ message: "food unSaved successfully" });
    }

    const save = await Save.create({
      user: user._id,
      food: foodId,
    });
    res.status(201).json({ message: "food saved successfully", save });
  } catch (error) {
    console.error("Error saving food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
