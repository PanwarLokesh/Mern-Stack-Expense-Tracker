const express = require("express");
const transactionRouter = express.Router();
const transactionController = require("../controllers/transactionController");
const isAuthenticated = require("../middlewares/isAuth");

transactionRouter.post(
    "/api/v1/transactions/create",
    isAuthenticated,
    transactionController.create
);
transactionRouter.get(
    "/api/v1/transactions/lists",
    isAuthenticated,
    transactionController.getFilteredTransactions
);

module.exports = transactionRouter;