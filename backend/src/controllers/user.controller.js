import { User } from "../models/user.js";
import { validEmail } from "../helpers/helpers.js";

export const createUser = async (req, res) => {
  try {
    const { name, surname, email } = req.body;

    // Validate data presence
    if (!name || !surname || !email) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    // Validate email format
    if (!validEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    // Validate a user with the same email doesn't exist
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({
        message: "User with this email already exists",
        success: false,
      });
    }

    // If all validations pass, create the user
    await User.create({ name, surname, email });
    res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while creating user",
      success: false,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error while fetching users",
      success: false,
    });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(email);

    // Validate email format
    if (!validEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    // Get user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // If user is found, return user data
    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Internal Server Error while fetching user",
        success: false,
      });
  }
};
