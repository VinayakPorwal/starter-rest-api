const express = require("express");

const router = express.Router();

// for youtube download and Related Info
const ytdl = require("ytdl-core");
const fetch = require("node-fetch");
const youtubesearchapi=require('youtube-search-api');


// for Youtube captions
var getSubtitles = require("youtube-captions-scraper").getSubtitles;

// Youtube Download API end Point
router.get("/download", async (req, res) => {
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
router.get("/relatedInfo", async (req, res) => {
  const info = await ytdl.getInfo(req.query.url);
  // return res.render(("download"), {
  return res.send({
    data: info.related_videos,
  });
});

// caption scraping
router.get("/caption", async (req, res) => {
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

// searching 
router.get("/search", async (req, res) => {
  try {
    const captions = youtubesearchapi.GetListByKeyword("Business",true,10)
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

module.exports = router;
