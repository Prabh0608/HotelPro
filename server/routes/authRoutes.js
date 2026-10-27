const express = require("express");
const router = express.Router();
const { register, login, getAllUsers } = require("../controllers/authController");

router.post("/SignUp", register);
router.post("/Login", login);
router.get("/getallusers", getAllUsers); // NEW

module.exports = router;