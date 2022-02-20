const HttpError = require("../models/http-error");
const { v4 } = require("uuid");
const { validationResult } = require("express-validator");

const getCoordsForAddress = require('../util/location');

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
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({ places });
}

async function createPlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch(error) {
    return next(error);
  }

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

function updatePlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const placeId = req.params.placeId;
  const { title, description } = req.body;
  const placeFoundIndex = DUMMY_PLACES.findIndex( place => place.id === placeId);
  if (placeFoundIndex === -1) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }
  DUMMY_PLACES[placeFoundIndex] = {
    ...DUMMY_PLACES[placeFoundIndex],
    title,
    description
  };
  res.status(200);
  res.json({place: DUMMY_PLACES[placeFoundIndex]});
}

function deletePlace(req, res, next) {
  const placeId = req.params.placeId;
  const placeFoundIndex = DUMMY_PLACES.findIndex( place => place.id === placeId);
  if (placeFoundIndex === -1) {
    return next(
      new HttpError("Could not find a place for the provided place id.", 404)
    );
  }
  DUMMY_PLACES.splice(placeFoundIndex, 1);
  res.status(200);
  res.json({message: 'Deleted place.'});
}

module.exports = { findPlaceById, findPlacesByUserId, createPlace, updatePlace, deletePlace };