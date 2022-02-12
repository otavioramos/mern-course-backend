const express = require("express");
const { check } = require("express-validator");

const {
  getAllUsers,
  signupUser,
  logInUser,
} = require("../controllers/user-controller");

const router = express.Router();

router.get("/", getAllUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  signupUser
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").not().isEmpty()],
  logInUser
);

module.exports = router;
