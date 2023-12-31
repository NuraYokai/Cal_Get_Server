const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key";

const handleErrors = (err, res) => {
  res.json({
    status: "FAILED",
    code: err.code || "UNKNOWN_ERROR",
    messages: err.message || "An unknown error occurred!",
  });
};

const validateEmail = (email) => {
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(email);
};

const findUser = async (email) => {
  try {
    const result = await userModel.find({ email });
    if (result.length === 0)
      throw new Error("User with the provided email does not exist");
    return result[0];
  } catch (err) {
    throw err;
  }
};

const comparePasswords = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) throw new Error("Invalid password entered!");
    return match;
  } catch (err) {
    throw err;
  }
};

const updateToken = async (email, token) => {
  try {
    await userModel.updateOne({ email }, { token });
    return token;
  } catch (err) {
    throw err;
  }
};

router.post("/signin", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    const messages = [];
    if (email === "" || password === "") {
      messages.push("Empty input fields!");
    }
    if (!validateEmail(email)) {
      messages.push("Invalid email entered!");
    }
    if (messages.length > 0) {
      throw new Error(messages.join(", "));
    }

    const user = await findUser(email);
    await comparePasswords(password, user.password);
    const token = jwt.sign({ email }, SECRET_KEY);
    const updatedToken = await updateToken(email, token);
    res.json({
      status: "SUCCESS",
      messages: "Signin Successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: updatedToken,
      },
    });
  } catch (err) {
    handleErrors(err, res);
  }
});

module.exports = router;
