const express = require("express");
const cors = require("cors");

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
router.post("/image", async (req, res) => {
  // return res.render(("download"), {
  const response = await openai.createImage({
    prompt: req.body.prompt,
    n: 2,
    size: "1024x1024",
  });
  return res.send({
    data: response.data,
  });
});

//ChatBot
router.post("/chat", async (req, res) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: req.body.prompt,

    temperature: 0,
    max_tokens: 2500,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });
  return res.send({
    data: response.data.choices,
    key: process.env.OPEN_AI+"nan",
  });
});

module.exports = router;
