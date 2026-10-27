const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes"); 

const app = express();
const PORT = process.env.PORT || 8001;
const allowedOrigins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS"));
  },
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((error) => console.error("❌ MongoDB connection error:", error.message));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
