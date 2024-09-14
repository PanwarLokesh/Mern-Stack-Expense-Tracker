const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/categoryController");
const isAuthenticated = require("../middlewares/isAuth");

categoryRouter.post(
  "/api/v1/categories/create",
  isAuthenticated,
  categoryController.create
);
categoryRouter.get(
  "/api/v1/categories/lists",
  isAuthenticated,
  categoryController.lists
);

module.exports = categoryRouter;
