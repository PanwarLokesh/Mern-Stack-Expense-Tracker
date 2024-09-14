const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { message } = require("prompt");
const usersController = {
  //? Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    //! validate
    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }
    //! check if user already exists
    const userExits = await User.findOne({ email });
    if (userExits) {
      throw new Error("User already exists");
    }
    //! hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //! create user
    const userCreated = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //! validate
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    //! verify user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }
    //! generate token
    const token = jwt.sign({ id: user._id }, "mysecretkey", {
      expiresIn: "3d",
    });

    res.json({
      message: "Logged in successfully",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),

  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }
    res.json({
      username: user.username,
      email: user.email,
    });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.save();
    res.json({ message: "Password changed successfully" });
  }),

  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "Profile updated successfully",
      updatedUser,
    });
  }),
};

module.exports = usersController;
