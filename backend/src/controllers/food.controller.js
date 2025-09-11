import { Food } from "../models/food.model.js";
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

export const getFood = async (req,res) =>{
  try {
    const foodItem = await Food.find({});
    res.status(200).json({
      message:"Food item fetched successfully",
      foodItem: foodItem
    })
  } catch (error) {
    console.error("Error getting food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
