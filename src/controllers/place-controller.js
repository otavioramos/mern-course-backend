const HttpError = require("../models/http-error");
const { v4 } = require("uuid");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

function findPlaceById(req, res, next) {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);
  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
  res.json({ place });
}

function findPlacesByUserId(req, res, next) {
  const userId = req.params.userId;
  const places = DUMMY_PLACES.filter((place) => place.creator === userId);
  if (places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  res.json({ places });
}

function createPlace(req, res, next) {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        id: v4(),
        title,
        description,
        location : coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createdPlace);
    res.status(201);
    res.json({place: createdPlace});
}

module.exports = { findPlaceById, findPlacesByUserId, createPlace }