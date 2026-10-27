const express = require("express");
const router = express.Router();
const { addRoom, getAllRooms } = require("../controllers/roomController");

router.post("/addroom", addRoom);
router.get("/getallrooms", getAllRooms);

module.exports = router;