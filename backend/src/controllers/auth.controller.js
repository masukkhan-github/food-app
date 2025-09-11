import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { FoodPartner } from "../models/foodPartner.model.js";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "user created successfully",
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: " User Register Server error", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "User Login Server error", error });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token").status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "User Logout server error : ", error });
  }
};

export const registerFoodPartner = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const partnerExists = await FoodPartner.findOne({ email });

    if (partnerExists) {
      return res.status(400).json({ message: "Food-partner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    const foodPartner = await FoodPartner.create({
      name:name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: foodPartner._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "Food-partner created successfully",
      foodPartner: {
        id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Food-partner Register server error ", error });
  }
};

export const loginFoodPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const partner = await FoodPartner.findOne({ email });

    if (!partner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, partner.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: partner._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "Food-Partner logged in successfully",
      foodPartner: {
        id: partner._id,
        name: partner.name,
        email: partner.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Food-partner login server error",
        error: error.message,
      });
  }
};

export const logoutFoodPartner = async (req, res) => {
  try {
    res.clearCookie("token").status(200).json({
      message: "Food-Partner logged out successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Food-Partner logout server error ", error });
  }
};
