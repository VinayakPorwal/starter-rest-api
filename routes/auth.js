const express = require("express");

const router = express.Router();
const User = require("./../models/user");
const { body, validationResult } = require("express-validator");

router.get("/users", async (req, res) => {
  const users = await User.find();
  // console.log(users);
  res.send(users);
});
router.get("/login/:id", async (req, res) => {
  console.log(req.params.id);
  res.json([req.params.id]);
});

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
      if (user.password !== req.body.password) {
        return res.status(400).json({
          error: "Wrong Password!,Please try to login with correct credentials",
          message: "Acceess Denied",
        });
      } else {
        res.json({ message: "Acceess Granted" });
      }
    } else {
      return res.status(400).json({
        error: "No user Found!,Please try to login with correct credentials",
        message: "Acceess Denied",
      });
    }
  }
);

router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then(() => res.json({ message: "Used Created" }))
      .catch((err) => {
        // console.log(err);
        res.json({ error: "please enter unique email", message: err.message });
      });
  }
);

module.exports = router;
