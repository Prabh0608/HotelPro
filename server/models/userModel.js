const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    userType: { type: String, required: true }, // 'Ordinary' or 'Admin'
    demoKey: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);