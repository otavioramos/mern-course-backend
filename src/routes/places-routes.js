const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    addres: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

router.get("/:placeId", (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);
  if (!place) {
    const error = new Error("Could not find a place for the provided id.");
    error.code = 404;
    throw error;
  }
  res.json({ place });
});

router.get("/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  const places = DUMMY_PLACES.filter((place) => place.creator === userId);
  if (places.length === 0) {
    const error = new Error("Could not find a place for the provided user id.");
    error.code = 404;
    return next(error);
  }

  res.json({ places });
});

module.exports = router;
