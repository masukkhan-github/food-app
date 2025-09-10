import { Food } from "../models/food.model.js";
import { uploadFile } from "../services/storage.service.js";
import { v4 as uuid } from "uuid";

export const listFood = async (req, res) => {
  console.log(req.foodPartner);
  console.log(req.file);

  const fileUploadResult = await uploadFile(req.file.buffer, uuid());
  console.log(fileUploadResult);

  res.json({ message: "uploaded" });
};
