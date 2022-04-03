const express = require('express')
const { check } = require('express-validator')

const { fileUpload } = require('../middlewares/file-upload')

const {
	findPlaceById,
	findPlacesByUserId,
	createPlace,
	updatePlace,
	deletePlace,
} = require('../controllers/place-controller')
const checkAuth = require('../middlewares/check-auth')

const router = express.Router()

router.get('/:placeId', findPlaceById)

router.get('/user/:userId', findPlacesByUserId)

router.use(checkAuth)

router.post(
	'/',
	fileUpload.single('image'),
	[
		check('title').not().isEmpty(),
		check('description').isLength({ min: 5 }),
		check('address').not().isEmpty(),
	],
	createPlace
)

router.patch(
	'/:placeId',
	[check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
	updatePlace
)

router.delete('/:placeId', deletePlace)

module.exports = router
