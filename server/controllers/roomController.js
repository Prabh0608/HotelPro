const roomModel = require("../models/roomModel");

exports.addRoom = async (req, res) => {
  try {
    const newRoom = new roomModel(req.body);
    const room = await newRoom.save();
    res.status(200).send({ msg: "Room added successfully", room });
  } catch (error) {
    res.status(500).send({ msg: "Failed to add room", error });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await roomModel.find({});
    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send(error);
  }
};