require("./config/db");

const PORT = process.env.PORT;

const express = require("express");
const app = express();

const UserRouter = require("./api/user");

const bodyParser = require("express").json;
app.use(bodyParser());

app.use((req, res, next) => {
  console.log(`URL hit "${req.path}" , Method "${req.method}"`);
  next();
});

app.use("/api/user", UserRouter);

app.listen(PORT, () => {
  console.log(`Server started at port http://localhost:${PORT}`);
});
