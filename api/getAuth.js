const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");

const handleErrors = (err, res) => {
  res.json({
    status: "FAILED",
    code: err.code || "UNKNOWN_ERROR",
    messages: err.message || "An unknown error occurred!",
  });
};

const findUserByIdAndToken = async (_id, token) => {
  try {
    const user = await userModel.findOne({ _id });
    if (!user) throw new Error("USER_NOT_FOUND");
    if (user.token !== token) throw new Error("TOKEN_MISMATCH");
    return user;
  } catch (err) {
    throw err;
  }
};

router.post("/getAuth", async (req, res) => {
  try {
    const { _id, token } = req.body;
    if (!_id) {
      return res.json({
        status: "FAILED",
        code: "MISSING_ID",
        messages: "ID is missing!",
      });
    }

    const user = await findUserByIdAndToken(_id, token);
    res.json({
      status: "SUCCESS",
      message: "Authentication successful",
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
