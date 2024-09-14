const express = require("express");
const userRouter = require("./routes/userRouter");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandlerMiddleware");

const app = express();

const PORT = process.env.PORT || 8000;
//! connect to mongodb
mongoose
  .connect("mongodb://localhost:27017/MERN-Expense-Tracker")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
//! Middleware
app.use(express.json());
//! Routes
app.use("/", userRouter);
//! error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
