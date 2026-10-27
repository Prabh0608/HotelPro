const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;
    
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ msg: "Email already registered", status: false });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      userType: userType || 'Ordinary',
    });

    res.status(200).send({ msg: "User registered successfully", status: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error", status: false });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    
    if (!user) {
      return res.status(404).send({ msg: "User not found", status: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Invalid credentials", status: false });
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.status(200).send({ 
      msg: "Login successful", 
      token, 
      user: { id: user._id, name: user.name, userType: user.userType } 
    });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error", status: false });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ msg: "Failed to fetch users", error });
  }
};