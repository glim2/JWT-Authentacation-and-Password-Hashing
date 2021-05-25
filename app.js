const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
const {
  models: { User },
} = require("./db");
const path = require("path");
const jwt = require("jsonwebtoken");

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.post("/api/auth", async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({where: {username}})
    if (bcrypt.compare(password, user.password)) {
      const userId = await User.authenticate({ username, password: user.password });
      const token = jwt.sign({ userId: userId }, process.env.JWT);
      res.send(token);
    }
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth", async (req, res, next) => {
  try {
    const verify = jwt.verify(req.headers.authorization, process.env.JWT);
    const authorizedUser = await User.byToken(verify.userId);

    res.send(authorizedUser);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
