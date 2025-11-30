const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");


router.post("/signup/buyer", authController.signupBuyer);

router.post("/signup/seller", authController.signupSeller);

router.post("/login", authController.login);

module.exports = router;
