const express = require("express");
const app = express();

const User = require("./models/user");
const path = require("path");
const cors = require("cors");
const auth = require("./routes/auth");
const Dbs = require("./db");
const fs = require("fs");

// for youtube download and Related Info
const ytdl = require("ytdl-core");
const fetch = require("node-fetch");

// for Youtube captions
var getSubtitles = require("youtube-captions-scraper").getSubtitles;
const axios = require("axios");

// for Open Ai ChatGPT
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  // apiKey: "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",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

//Middel Wares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.use("/auth", auth);
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

// Youtube Download API end Point
app.get("/download", async (req, res) => {
  const v_id = req.query.url.split("v=")[1];
  const info = await ytdl.getInfo(req.query.url);
  // return res.render(("download"), {
  return res.send({
    url: "https://www.youtube.com/embed/" + v_id,
    info: info.formats.sort((a, b) => {
      return a.mimeType < b.mimeType;
    }),
    data: info.videoDetails,
  });
});

// Youtube Video Related Info API end Point
app.get("/relatedInfo", async (req, res) => {
  const info = await ytdl.getInfo(req.query.url);
  // return res.render(("download"), {
  return res.send({
    data: info.related_videos,
  });
});

// caption scraping
app.get("/caption", async (req, res) => {
  try {
    var captions = await getSubtitles({
      videoID: req.query.id, // youtube video id
      lang: "en", // default: `en`
    });
    if (captions) {
      return res.send({
        data: captions,
      });
    } else {
      res.send("No Captions Found");
    }
  } catch (error) {
    // TypeError: Failed to fetch

    res.send({ Error: `Could not find captions for video: ${req.query.id}` });
  }
});

// Image Generation
app.post("/image", async (req, res) => {
  // return res.render(("download"), {
  const response = await openai.createImage({
    prompt: req.body.prompt,
    n: 2,
    size: "1024x1024",
  });
  return res.send({
    data : response.data,
  });
});

//ChatBot
app.post("/chat", async (req, res) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: req.body.prompt,
    max_tokens: 2500,
    temperature: 0.5,
  });
  return res.send({
    data : response.data.choices,
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
