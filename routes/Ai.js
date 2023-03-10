const express = require("express");
const cors = require("cors");
var fetchuser = require("./middleWare");
const { User, Image } = require("./../models/user");
const fetch = require("node-fetch");


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
      return res.send({ error: "Insufficient Token in Wallet to Generate Response!" });
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
      return res.send({ error: "Insufficient Token in Wallet to Generate Response!" });
    }
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.prompt,
      temperature: 0,
      max_tokens: 3000,
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



//Stock
router.get('/stock/:id', (req, res) => {
  const  tickers = req.params.id;
  const url = `https://api.tiingo.com/iex/?tickers=${tickers}&token=2bf8652da8a14670611b54029fb116ac91870f40`;

  // Forward the request to the Tiingo API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Set the CORS headers
      res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');

      // Send the response data
      res.send(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ message: 'Error fetching data from Tiingo API' });
    });
});


module.exports = router;
