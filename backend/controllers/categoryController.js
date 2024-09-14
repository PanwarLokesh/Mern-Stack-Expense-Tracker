const asyncHandler = require("express-async-handler");

const Category = require("../model/Category");

const categoryController = {
  //!adding
  create: asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
      throw new Error("All fields are required");
    }
    const normalizedName = name.toLowerCase();
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type)) {
      throw new Error("Invalid Category type " + type);
    }

    const categoryExits = await Category.findOne({
      name: normalizedName,
      user: req.user,
    });

    if (categoryExits) {
      throw new Error(`${categoryExits.name} already exists`);
    }
    const category = await Category.create({
      name: normalizedName,
      type,
      user: req.user,
    });
    res.status(200).json(category);
  }),

  //! All List
  lists: asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user });
    res.status(200).json(categories);
  }),
};

module.exports= categoryController;