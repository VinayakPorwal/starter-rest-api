const express = require("express");
const app = express();

const User = require("./models/user");
const path = require("path");
const cors = require("cors");
const auth = require("./routes/auth");
const Ai = require("./routes/Ai");
const Yt = require("./routes/Yt");
const Dbs = require("./db");
const fs = require("fs");
const dotenv = require("dotenv");
const axios = require("axios");

//Middel Wares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.use("/auth", auth);
app.use("/Ai", Ai);
app.use(Yt);
dotenv.config();
process.env.YTDL_NO_UPDATE = "1";

app.get("/users", async (req, res) => {
  const users = await User.find();
  console.log(users);
  res.json({ user: users }).end();
});

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/index", (req, res) => {
  return res.render("index");
});

// Get One Random Qoute
app.get("/Qoutes/random", async (req, res) => {
  let rnum = Math.floor(Math.random() * 100);
  let data = await fetch("https://type.fit/api/quotes");
  let realData = await data.json();

  return res.send({
    author: realData[rnum].author,
    qoute: realData[rnum].text,
    key: process.env.OPEN_AI + "naksnc",
  });
});
// All Qoutes
app.get("/Qoutes", async (req, res) => {
  let data = await fetch("https://type.fit/api/quotes");
  let realData = await data.json();
  return res.send({
    realData,
  });
});

// Catch all handler for all other request.
app.use("*", (req, res) => {
  res.json({ msg: "Welcome" }).end();
  // res.sendFile(path.join(__dirname, "./index.html"));
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`index.js listening on ${port}`);
});
