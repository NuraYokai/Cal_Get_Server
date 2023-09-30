const express = require("express");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`URL hit "${req.path}" , Method "${req.method}"`);
  next();
});

app.listen(PORT, () => {
  console.log(`Server started at port http://localhost:${PORT}`);
});
