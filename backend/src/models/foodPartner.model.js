import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

export const FoodPartner = mongoose.model("FoodPartner", foodPartnerSchema);
