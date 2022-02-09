const express = require("express");

const HttpError = require("../models/http-error");
const { findPlaceById, findPlacesByUserId, createPlace } = require("../controllers/place-controller");

const router = express.Router();

router.get("/:placeId", findPlaceById);

router.get("/user/:userId", findPlacesByUserId);

router.post("/", createPlace);

module.exports = router;
