const express = require("express");
const cors = require("cors");
var fetchuser = require("./middleWare");
const { User, Image } = require("./../models/user");

const dotenv = require("dotenv");
const router = express.Router();
dotenv.config();

// for Open Ai ChatGPT
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI,
});
const openai = new OpenAIApi(configuration);

// Image Generation
router.post("/image", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (user.Wallet === 0) {
      return res.send({ data: "Empty Wallet" });
    }
    const response = await openai.createImage({
      prompt: req.body.prompt,
      n: 2,
      size: "256x256",
    });
    res.send({
      data: response.data,
    });
    user.Wallet = user.Wallet - 1;
    await user.save();
    // console.log(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ChatBot
router.post("/chat", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (user.Wallet === 0) {
      return res.send({ data: "Empty Wallet" });
    }
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.prompt,
      temperature: 0,
      max_tokens: 2500,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    res.send({
      data: response.data.choices,
    });
    user.Wallet = user.Wallet - 1;
    await user.save();
    // console.log(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
