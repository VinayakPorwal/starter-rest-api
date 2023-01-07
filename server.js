const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const auth = require("./routes/auth");
const Db = require("./db");
const path = require("path");

app.use(express.json());
app.use(cors());

app.use(express.static("../dist"));

// app.get("/", (req, res) => {
//   res.status(200);

//   res.send("this is home");
// });

app.get("/aboutWeb", (req, res) => {
  res.status(200);
  res.send("this is about");
});
app.use("/auth", auth);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${port}/`);
});
