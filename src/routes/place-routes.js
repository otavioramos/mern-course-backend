const express = require('express');
const { check } = require('express-validator');

const {
  findPlaceById,
  findPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require('../controllers/place-controller');

const router = express.Router();

router.get('/:placeId', findPlaceById);

router.get('/user/:userId', findPlacesByUserId);

router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  createPlace
);

router.patch(
  '/:placeId',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  updatePlace
);

router.delete('/:placeId', deletePlace);

module.exports = router;
