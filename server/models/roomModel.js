const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { type: Number, required: true },
  count: { type: Number, required: true },
  rent: { type: Number, required: true },
  type: { type: String, required: true },
  photos: [],
  description: { type: String, required: true },
  currentbooking: [],
  demoKey: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("rooms", roomSchema);