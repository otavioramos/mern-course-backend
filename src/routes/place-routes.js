const express = require("express");

const HttpError = require("../models/http-error");
const placeControllers = require("../controllers/place-controller");

const router = express.Router();

router.get("/:placeId", placeControllers.findPlaceById);

router.get("/user/:userId", placeControllers.findPlacesByUserId);

router.post("/", placeControllers.createPlace);

module.exports = router;
