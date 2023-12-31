require("./config/db");

const PORT = process.env.PORT;

const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

const SignupRouter = require("./api/signup");
const SigninRouter = require("./api/signin");
const GetAuthRouter = require("./api/getAuth");

const bodyParser = require("express").json;
app.use(bodyParser());

app.use((req, res, next) => {
  console.log(`URL hit "${req.path}" , Method "${req.method}"`);
  next();
});

app.use("/api/user", SignupRouter);
app.use("/api/user", SigninRouter);
app.use("/api/user", GetAuthRouter);

app.listen(PORT, () => {
  console.log(`Server started at port http://localhost:${PORT}`);
});
