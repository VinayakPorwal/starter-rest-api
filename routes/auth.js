const express = require("express");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const router = express.Router();
const { User, Image, Review } = require("./../models/user");
const { body, validationResult } = require("express-validator");
var fetchuser = require("./middleWare");
const JWT_SECRET = "CraftXForWeb3";

// Get Users
router.get("/users", async (req, res) => {
  const users = await User.find();
  console.log(users);
  res.json({ user: users }).end();
});

// Testing Route
router.get("/login/:id", async (req, res) => {
  console.log(req.params.id);
  res.json([req.params.id]);
});

// LOGIN route
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password must not be empty").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const passwordCompare = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordCompare) {
        return res.status(400).json({
          error: "Wrong Password!,Please try to login with correct credentials",
          message: "Acceess Denied",
        });
      }
      const user_data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(user_data, JWT_SECRET);
      res.json({ message: "Acceess Granted", user_data, authtoken });
    } else {
      return res.status(400).json({
        error: "No user Found!,Please try to login with correct credentials",
        message: "Acceess Denied",
      });
    }
  }
);

// SignUp route
router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        Bio: req.body.bio,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ message: "Used Created", data, authtoken });
    } catch (err) {
      // console.log(err);
      res.json({ error: "please enter unique email", message: err.message });
    }
  }
);

// ROUTE 3: Get loggedin User Details. Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Get loggedin User Details. Login required
router.post("/getusers", async (req, res) => {
  try {
    let userId = req.body.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: to update some info of user
router.post("/update", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    let bio = req.body.bio;
    let api = req.body.Api_key;
    let wallet = req.body.Wallet;
    const user = await User.findById(userId).select("-password");
    if (req.body.bio) {
      user.Bio = bio;
      await user.save();
    }

    if (api) {
      user.Api_key = api;
      await user.save();
    }
    if (wallet) {
      user.Wallet = wallet;
      await user.save();
    }
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Get loggedin User Details. Login required
router.post("/Reviews", async (req, res) => {
  try {
    let review = req.body.review;
    let name = req.body.name;

    const reviewGenerate = await Review.create({
      name: name,
      review: review,
    });

    res.status(201).send(reviewGenerate);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// ROUTE 4: Get loggedin User Details. Login required
router.get("/GetReviews", async (req, res) => {
  try {
    const reviewGenerate = await Review.find();
    res.status(200).send(reviewGenerate);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/approve", async (req, res) => {
  try {
    let id = req.body.id;
    const review = await Review.findById(id);
    review.approval = true;
    await review.save();
    res.status(201).send("Approved");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Image upload

// router.post('/upload', upload.single('image'), (req, res) => {
//   // req.file contains the image data
//   console.log(req.file);

//   // you can now process the image and send it to your server

//   res.json({
//       message: 'Image uploaded successfully'
//   });
// });

router.post("/image", (req, res) => {
  console.log(req.body);
  res.send(req.body.name);
});

module.exports = router;
