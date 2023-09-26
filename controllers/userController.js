// UserController.js
const User = require("../models/user");

// Controller logic for User model
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.create({ name, email });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
};
