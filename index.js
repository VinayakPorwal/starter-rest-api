const express = require("express");
const app = express();
// const db = require("@cyclic.sh/dynamodb");

const User = require("./models/user");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require("path");
const cors = require("cors");
const auth = require("./routes/auth");
const Dbs = require("./db");
const fs = require("fs");
const ytdl = require("ytdl-core");

app.set("view engine", "ejs");
app.use(express.json());
app.use(cors());
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

app.get("/transcript", async (req, res) => {
  // const v_id = req.query.url.split('v=')[1];
  return res.send({
    details: "here",
  });
});

app.get("/download", async (req, res) => {
  const v_id = req.query.url.split("v=")[1];
  const info = await ytdl.getInfo(req.query.url);
  // return res.render(("download"), {
  return res.send({
    url: "https://www.youtube.com/embed/" + v_id,
    info: info.formats.sort((a, b) => {
      return a.mimeType < b.mimeType;
    }),
    data : info.related_videos,
  });
});
app.get("/relatedInfo", async (req, res) => {
  const info = await ytdl.getInfo(req.query.url);
  // return res.render(("download"), {
  return res.send({
    data : info.related_videos,
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

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################

// Create or Update an item
// app.post('/:col/:key', async (req, res) => {
//   console.log(req.body)

//   const col = req.params.col
//   const key = req.params.key
//   console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
//   const item = await db.collection(col).set(key, req.body)
//   console.log(JSON.stringify(item, null, 2))
//   res.json(item).end()
// })

// Delete an item
// app.delete('/:col/:key', async (req, res) => {
//   const col = req.params.col
//   const key = req.params.key
//   console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
//   const item = await db.collection(col).delete(key)
//   console.log(JSON.stringify(item, null, 2))
//   res.json(item).end()
// })

// Get a single item
// app.get('/:col/:key', async (req, res) => {
//   const col = req.params.col
//   const key = req.params.key
//   console.log(`from collection: ${col} get key: ${key} with params ${JSON.stringify(req.params)}`)
//   const item = await db.collection(col).get(key)
//   console.log(JSON.stringify(item, null, 2))
//   res.json(item).end()
// })

// Get a full listing
// app.get('/:col', async (req, res) => {
//   const col = req.params.col
//   console.log(`list collection: ${col} with params: ${JSON.stringify(req.params)}`)
//   const items = await db.collection(col).list()
//   console.log(JSON.stringify(items, null, 2))
//   res.json(items).end()
// })
