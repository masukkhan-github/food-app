import { Food } from "../models/food.model.js";
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

    // If request has an authenticated user, include liked/saved flags per item
    if (req.user && req.user._id) {
      const foodIds = foodItem.map((f) => f._id);
      const likes = await Like.find({ user: req.user._id, food: { $in: foodIds } });
      const saves = await Save.find({ user: req.user._id, food: { $in: foodIds } });

      const likedSet = new Set(likes.map((l) => String(l.food)));
      const savedSet = new Set(saves.map((s) => String(s.food)));

      const mapped = foodItem.map((f) => ({
        _id: f._id,
        name: f.name,
        video: f.video,
        description: f.description,
        foodPartner: f.foodPartner,
        likeCount: f.likeCount || 0,
        liked: likedSet.has(String(f._id)),
        saved: savedSet.has(String(f._id)),
      }));

      return res.status(200).json({ message: "Food item fetched successfully", foodItem: mapped });
    }

    res.status(200).json({ message: "Food item fetched successfully", foodItem: foodItem });
  } catch (error) {
    console.error("Error getting food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSavedFoods = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) return res.status(401).json({ message: "Unauthorized" });

    const saves = await Save.find({ user: user._id }).populate('food');
    const foods = saves
      .map((s) => s.food)
      .filter(Boolean)
      .map((f) => ({
        _id: f._id,
        name: f.name,
        video: f.video,
        description: f.description,
        foodPartner: f.foodPartner,
        likeCount: f.likeCount || 0,
        saved: true,
      }));

    res.status(200).json({ message: 'Saved foods fetched', foodItem: foods });
  } catch (error) {
    console.error('Error fetching saved foods:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const likeFood = async (req, res) => {
  const { foodId } = req.body;
  const user = req.user;

  if (!user || !user._id) {
    return res.status(401).json({ message: "Please login first" });
  }

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

  if (!user || !user._id) {
    return res.status(401).json({ message: "Please login first" });
  }
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
