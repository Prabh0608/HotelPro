const bookingModel = require("../models/bookingModel");
const roomModel = require("../models/roomModel");

exports.bookRoom = async (req, res) => {
  try {
    const newBooking = new bookingModel(req.body);
    const booking = await newBooking.save();

    // Update the room's currentbooking array to track occupancy
    const room = await roomModel.findById(booking.roomid);
    room.currentbooking.push({
      bookingid: booking._id,
      fromdate: booking.fromdate,
      todate: booking.todate,
      userid: booking.userid,
      status: booking.status
    });
    await room.save();

    res.status(200).send({ msg: "Room booked successfully", booking });
  } catch (error) {
    res.status(500).send({ msg: "Booking failed", error });
  }
};

// ... existing bookRoom function ...

exports.getUserBookings = async (req, res) => {
  try {
    const { userid } = req.body;
    const bookings = await bookingModel.find({ userid });
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send({ msg: "Failed to fetch bookings", error });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingid } = req.body;
    const booking = await bookingModel.findById(bookingid);
    
    if (!booking) {
      return res.status(404).send({ msg: "Booking not found" });
    }

    booking.status = 'cancelled';
    await booking.save();

    await roomModel.updateOne(
      { _id: booking.roomid, "currentbooking.bookingid": booking._id },
      { $set: { "currentbooking.$.status": "cancelled" } }
    );
    
    res.status(200).send({ msg: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Failed to cancel booking", error });
  }
};
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find({});
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send({ msg: "Failed to fetch all bookings", error });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { bookingid } = req.params;
    const { fromdate, todate, status } = req.body;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fromdate) || !/^\d{4}-\d{2}-\d{2}$/.test(todate)) {
      return res.status(400).send({ msg: "Enter valid check-in and check-out dates" });
    }

    const start = Date.parse(`${fromdate}T00:00:00Z`);
    const end = Date.parse(`${todate}T00:00:00Z`);
    if (
      Number.isNaN(start) ||
      Number.isNaN(end) ||
      new Date(start).toISOString().slice(0, 10) !== fromdate ||
      new Date(end).toISOString().slice(0, 10) !== todate
    ) {
      return res.status(400).send({ msg: "Enter valid check-in and check-out dates" });
    }
    const totaldays = (end - start) / 86400000;
    if (!Number.isInteger(totaldays) || totaldays < 1) {
      return res.status(400).send({ msg: "Check-out must be after check-in" });
    }

    if (!["booked", "cancelled"].includes(status)) {
      return res.status(400).send({ msg: "Choose a valid booking status" });
    }

    const booking = await bookingModel.findById(bookingid);
    if (!booking) {
      return res.status(404).send({ msg: "Booking not found" });
    }

    const room = await roomModel.findById(booking.roomid);
    if (!room) {
      return res.status(404).send({ msg: "The room for this booking was not found" });
    }

    booking.fromdate = fromdate;
    booking.todate = todate;
    booking.totaldays = totaldays;
    booking.totalAmount = totaldays * room.rent;
    booking.status = status;
    await booking.save();

    await roomModel.updateOne(
      { _id: room._id, "currentbooking.bookingid": booking._id },
      {
        $set: {
          "currentbooking.$.fromdate": fromdate,
          "currentbooking.$.todate": todate,
          "currentbooking.$.status": status,
        },
      }
    );

    res.status(200).send({ msg: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Failed to update booking:", error);
    res.status(500).send({ msg: "Failed to update booking" });
  }
};