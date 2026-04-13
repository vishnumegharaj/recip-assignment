const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config();
const userRoute = require("./routes/auth.js")
const app = express()

app.use(cors())
app.use(express.json({ limit: '80mb' }));
app.use(express.urlencoded({ extended: true, limit: '80mb' }));

app.use("/api/users", userRoute)

//Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, errors: messages });
  }

  // Duplicate key error (unique field conflict)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  // Fallback — 500
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

//MongoDB + Server connection
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}).catch((error) => {
  console.log("Failed to connect to MongoDB");
});