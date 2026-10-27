const express = require("express");
const router = express.Router();
const { bookRoom, getUserBookings, cancelBooking, getAllBookings, updateBooking } = require("../controllers/bookingController");
const requireAdmin = require("../middleware/requireAdmin");

router.post("/bookroom", bookRoom);
router.post("/getuserbookings", getUserBookings);
router.post("/cancelbooking", cancelBooking);
router.get("/getallbookings", getAllBookings); // NEW
router.put("/:bookingid", requireAdmin, updateBooking);

module.exports = router;