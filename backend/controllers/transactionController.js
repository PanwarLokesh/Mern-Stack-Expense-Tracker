const asyncHandler = require("express-async-handler");

const Transaction = require("../model/Transaction");

const transactionController = {
  create: asyncHandler(async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    if ((!amount, !date, !type)) {
      throw new Error("Type , date and amount are required");
    }
    const transaction = await Transaction.create({
      user: req.user,
      type,
      category,
      amount,
      description,
    });
    res.status(201).json(transaction);
  }),

  getFilteredTransactions: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    let filters = { user: req.user };
    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    if (type) {
      filters.type = type;
    }
    if (category) {
      if (category === "Uncategorized") {
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }
    const transaction = await Transaction.find(filters).sort({ date: -1 });
    res.json(transaction);
  }),

  update: asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      transaction.type = req.body.type || transaction.type;
      transaction.category = req.body.category || transaction.category;
      transaction.amount = req.body.amount || transaction.amount;
      transaction.date = req.body.date || transaction.date;
      transaction.description = req.body.description || transaction.description;

      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    }
  }),

  delete: asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      await Transaction.findByIdAndDelete(req.params.id);
      console.log("Transaction deleted successfully");
      res.json({ message: "Transaction deleted successfully" });

    }
  })
};

module.exports = transactionController;
