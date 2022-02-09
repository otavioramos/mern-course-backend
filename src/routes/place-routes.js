const express = require("express");

const HttpError = require("../models/http-error");
const { findPlaceById, 
    findPlacesByUserId, 
    createPlace,
    updatePlace,
    deletePlace
    } = require("../controllers/place-controller");

const router = express.Router();

router.get("/:placeId", findPlaceById);

router.get("/user/:userId", findPlacesByUserId);

router.post("/", createPlace);

router.patch("/:placeId", updatePlace);

router.delete("/:placeId", deletePlace);

module.exports = router;
