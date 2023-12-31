const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const handleErrors = (err, res) => {
  res.json({
    status: "FAILED",
    code: err.code || "UNKNOWN_ERROR",
    messages: err.message || "An unknown error occurred!",
  });
};

const validateName = (name) => {
  const regex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  return regex.test(name);
};

const validateEmail = (email) => {
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(email);
};

const findUser = async (email) => {
  try {
    const result = await userModel.find({ email });
    if (result.length !== 0)
      throw new Error("User with the provided email already exists");
  } catch (err) {
    throw err;
  }
};

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    throw err;
  }
};

const createUser = async (name, email, hashedPassword) => {
  try {
    const newUser = new userModel({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (err) {
    throw err;
  }
};

router.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    const messages = [];
    if (name === "" || email === "" || password === "") {
      messages.push("Empty input fields!");
    }
    if (!validateName(name)) {
      messages.push("Invalid name entered!");
    }
    if (!validateEmail(email)) {
      messages.push("Invalid email entered!");
    }
    if (password.length < 8) {
      messages.push("Password is too short");
    }
    if (messages.length > 0) {
      throw new Error(messages.join(", "));
    }

    await findUser(email);
    const hashedPassword = await hashPassword(password);
    const user = await createUser(name, email, hashedPassword);
    res.json({
      status: "SUCCESS",
      messages: "Signup Successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    handleErrors(err, res);
  }
});

module.exports = router;
