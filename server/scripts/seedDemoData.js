const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const userModel = require("../models/userModel");
const roomModel = require("../models/roomModel");
const bookingModel = require("../models/bookingModel");

const CONFIRMED_DATABASE = "Roomly";
const CONFIRM_ATLAS = "--confirm-atlas";
const DEMO_PASSWORD = "HotelProDemo!2026";
const DEMO_ACCOUNTS = [
  {
    demoKey: "hotelpro-demo-admin-v1",
    name: "HotelPro Demo Admin",
    email: "admin@hotelpro.test",
    phone: 9000000001,
    userType: "Admin",
  },
  {
    demoKey: "hotelpro-demo-customer-v1",
    name: "Aanya Sharma",
    email: "guest@hotelpro.test",
    phone: 9000000002,
    userType: "Ordinary",
  },
];

const DEMO_ROOMS = [
  {
    demoKey: "hotelpro-demo-room-901-v1",
    roomNumber: 901,
    count: 2,
    rent: 4200,
    type: "Delux",
    description: "Demo room: a light-filled king room with a private garden view.",
    photos: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=90"],
  },
  {
    demoKey: "hotelpro-demo-room-902-v1",
    roomNumber: 902,
    count: 2,
    rent: 2800,
    type: "Non-Delux",
    description: "Demo room: a comfortable city room with a queen bed and a calm palette.",
    photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=90"],
  },
  {
    demoKey: "hotelpro-demo-room-903-v1",
    roomNumber: 903,
    count: 4,
    rent: 6500,
    type: "Delux",
    description: "Demo room: a spacious suite with a separate area for a relaxed family stay.",
    photos: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=90"],
  },
];

const toDateString = (date) => date.toISOString().slice(0, 10);
const offsetDate = (offset) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date;
};

const verifyTarget = () => {
  const confirmedLocal = process.argv[2] === `--confirm-database=${CONFIRMED_DATABASE}`;
  const confirmedAtlas = process.argv[2] === CONFIRM_ATLAS;
  if (!confirmedLocal && !confirmedAtlas) {
    throw new Error(`Pass --confirm-database=${CONFIRMED_DATABASE} for local seeding or ${CONFIRM_ATLAS} for Atlas seeding.`);
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured in server/.env.");
  }

  const uri = new URL(process.env.MONGO_URI);
  const database = decodeURIComponent(uri.pathname.replace(/^\/+/, ""));
  if (confirmedLocal && database !== CONFIRMED_DATABASE) {
    throw new Error(`Configured database is "${database || "(default)"}", not "${CONFIRMED_DATABASE}". No data was changed.`);
  }
  if (confirmedLocal && !["localhost", "127.0.0.1", "::1", "[::1]"].includes(uri.hostname)) {
    throw new Error("Demo seeding is restricted to a local MongoDB server. No data was changed.");
  }
  if (confirmedAtlas && !uri.hostname.endsWith(".mongodb.net")) {
    throw new Error("Atlas seeding requires a MongoDB Atlas connection (*.mongodb.net). No data was changed.");
  }
};

const seed = async () => {
  verifyTarget();
  await mongoose.connect(process.env.MONGO_URI);

  const accountsByEmail = await userModel.find({
    email: { $in: DEMO_ACCOUNTS.map(({ email }) => email) },
  }).select("email demoKey");
  const conflictingAccount = accountsByEmail.find((account) => !account.demoKey);
  if (conflictingAccount) {
    throw new Error(`The demo email ${conflictingAccount.email} is already in use by a non-demo account. No demo records were seeded.`);
  }

  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const account of DEMO_ACCOUNTS) {
    await userModel.updateOne(
      { demoKey: account.demoKey },
      { $set: { ...account, password } },
      { upsert: true, runValidators: true }
    );
  }

  for (const room of DEMO_ROOMS) {
    await roomModel.updateOne(
      { demoKey: room.demoKey },
      { $set: room, $setOnInsert: { currentbooking: [] } },
      { upsert: true, runValidators: true }
    );
  }

  const [customer, ...rooms] = await Promise.all([
    userModel.findOne({ demoKey: DEMO_ACCOUNTS[1].demoKey }),
    ...DEMO_ROOMS.map(({ demoKey }) => roomModel.findOne({ demoKey })),
  ]);
  if (!customer || rooms.some((room) => !room)) {
    throw new Error("Failed to load the seeded demo customer or rooms.");
  }

  const reservations = [
    { demoKey: "hotelpro-demo-booking-upcoming-v1", room: rooms[0], fromOffset: 10, nights: 3, status: "booked" },
    { demoKey: "hotelpro-demo-booking-suite-v1", room: rooms[2], fromOffset: 30, nights: 2, status: "booked" },
    { demoKey: "hotelpro-demo-booking-cancelled-v1", room: rooms[1], fromOffset: -10, nights: 2, status: "cancelled" },
  ];

  for (const reservation of reservations) {
    const fromdate = toDateString(offsetDate(reservation.fromOffset));
    const todate = toDateString(offsetDate(reservation.fromOffset + reservation.nights));
    const booking = await bookingModel.findOneAndUpdate(
      { demoKey: reservation.demoKey },
      {
        $set: {
          roomid: reservation.room._id,
          type: reservation.room.type,
          userid: customer._id,
          username: customer.name,
          fromdate,
          todate,
          totalAmount: reservation.room.rent * reservation.nights,
          totaldays: reservation.nights,
          phone: customer.phone,
          cardDetails: {
            cardholdername: "DEMO DATA ONLY",
            cardnumber: "0000000000000000",
            cvvcode: "000",
            expmonthyear: "12/99",
          },
          status: reservation.status,
        },
        $setOnInsert: { demoKey: reservation.demoKey },
      },
      { upsert: true, returnDocument: "after", runValidators: true }
    );

    await roomModel.updateOne(
      { _id: reservation.room._id, "currentbooking.bookingid": booking._id },
      {
        $set: {
          "currentbooking.$.fromdate": fromdate,
          "currentbooking.$.todate": todate,
          "currentbooking.$.userid": customer._id,
          "currentbooking.$.status": reservation.status,
        },
      }
    );
    await roomModel.updateOne(
      { _id: reservation.room._id, "currentbooking.bookingid": { $ne: booking._id } },
      {
        $push: {
          currentbooking: {
            bookingid: booking._id,
            fromdate,
            todate,
            userid: customer._id,
            status: reservation.status,
          },
        },
      }
    );
  }

  console.log("Demo data is ready in the confirmed MongoDB database.");
  console.log("Admin login: admin@hotelpro.test / HotelProDemo!2026");
  console.log("Customer login: guest@hotelpro.test / HotelProDemo!2026");
  console.log("Seeded 3 rooms and 3 bookings linked to the demo customer.");
};

seed()
  .catch((error) => {
    console.error(`Demo data seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
