const asyncHandler = require("express-async-handler");

const Category = require("../model/Category");
const Transaction = require("../model/Transaction");

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
    res.status(201).json(category);
  }),

  //! All List
  lists: asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user });
    res.status(200).json(categories);
  }),

  update: asyncHandler(async (req, res) => {
    const {id:categoryId} = req.params;
    const { type, name } = req.body;
    const normalizedName = name.toLowerCase();
    const category = await Category.findById(categoryId);
    if (!category && category.user.toString() !== req.user.toString()) {
      res.json({ message: "Category not found or user not authorized" });
    }
    const oldName = category.name;
    category.name = normalizedName|| category.name; ;
    category.type = type || category.type;
    const updatedCategory = await category.save();
    if (updatedCategory.name !== oldName) {
      await Transaction.updateMany(
        {
          user: req.user,
          category: oldName,
        },
        {
          $set: {
            category: updatedCategory.name,
          },
        }
      );
    }
    res.json(updatedCategory);
  }),

  delete: asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category && category.user.toString() === req.user.toString()) {
      const defaultCategory = "Uncategorized";
      await Transaction.updateMany(
        {
          user: req.user,
          category: category.name,
        },
        {
          $set: {
            category: defaultCategory,
          },
        }
      );
      await Category.findByIdAndDelete(req.params.id);
      res.json({message: "Category deleted successfully and transactions updated"});
    }
    else{
      res.json({message: "Category not found or user not authorized"});
    }
  }),
};

module.exports = categoryController;
