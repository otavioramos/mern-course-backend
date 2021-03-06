const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const fs = require('fs')

const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')
const User = require('../models/user')

async function findPlaceById(req, res, next) {
	const placeId = req.params.placeId
  
	let place
	try {
		place = await Place.findById(placeId)
	} catch(err) {
		const error = new HttpError(
			'Something went wrong, could not find a place',
			500
		)
		return next(error)
	}
	if(!place) {
		const error = new HttpError('Could not find a place for the provided id.', 404)
		return next(error)
	}

	res.json({ place: place.toObject({ getters: true }) })
}

async function findPlacesByUserId(req, res, next) {
	const userId = req.params.userId

	let userWithPlaces
	try {
		userWithPlaces = await User.findById(userId).populate('places')
	} catch(err) {
		const error = new HttpError(
			'Something went wrong, could not find places',
			500
		)
		return next(error)
	}

	if (!userWithPlaces || userWithPlaces.places.length === 0) {
		return next(
			new HttpError('Could not find places for the provided user id.', 404)
		)
	}

	res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) })
}

async function createPlace(req, res, next) {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		next(new HttpError('Invalid inputs passed, please check your data.', 422))
	}

	const { title, description, address} = req.body

	let coordinates
	try {
		coordinates = await getCoordsForAddress(address)
	} catch(error) {
		return next(error)
	}

	const userIdBasedOnToken = req.userData.userId

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image: req.file.path,
		creator: userIdBasedOnToken
	})

	let user
	try {
		user = await User.findById(userIdBasedOnToken)
	} catch(err) {
		const error = new HttpError('Creating place failed, please try again.', 500)
		return next(error)
	}

	if (!user) {
		const error = new HttpError('Could not find user for provided id.', 404)
		return next(error)
	}

	try {
		// If saving 'place' or 'user' fails, both transactions will aborted
		const session = await mongoose.startSession()
		session.startTransaction()
		await createdPlace.save({session: session})
		user.places.push(createdPlace)
		await user.save({session: session})
		await session.commitTransaction()
	} catch(err) {
		const error = new HttpError(
			'Creating place failed, please try again.',
			500
		)
		console.log(err)
		return next(error)
	}

	res.status(201)
	res.json({place: createdPlace})
}

async function updatePlace(req, res, next) {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422))
	}

	const placeId = req.params.placeId
	const { title, description } = req.body
  
	let place
	try{
		place = await Place.findById(placeId)
	} catch(err) {
		const error = new HttpError('Something went wrong, could not update place.', 500)
		return next(error)
	}

	if (place.creator.toString() !== req.userData.userId) {
		const error = new HttpError('You are not allowed to edit this place', 401)
		return next(error)
	}

	place.title = title
	place.description = description

	try {
		await place.save()
	} catch(err) {
		const error = new HttpError('Something went wrong, could not update place.', 500)
		return next(error)
	}

	res.status(200)
	res.json({place: place.toObject({getters: true})})
}

async function deletePlace(req, res, next) {
	const placeId = req.params.placeId
  
	let place
	try {
		// 'populate' method will load all properties from 'user' model with userId located in 'creator' property
		// This works because of the relation configured in their Schemas definition
		place = await Place.findById(placeId).populate('creator')
	} catch(err) {
		const error = new HttpError('Something went wrong, could not delete place', 500)
		return next(error)
	}

	if(!place) {
		const error = new HttpError('Could not find place for the provided id.', 404)
		return next(error)
	}

	if (place.creator.id !== req.userData.userId) {
		const error = new HttpError('You are not allowed to delete this place', 401)
		return next(error)
	}

	const imagePath = place.image

	try {
		const session = await mongoose.startSession()
		session.startTransaction()
		await place.remove({session: session})
		place.creator.places.pull(place)
		await place.creator.save({session: session})
		session.commitTransaction()
	} catch(err) {
		const error = new HttpError('Something went wrong, could not delete place', 500)
		return next(error)
	}

	fs.unlink(imagePath, err => console.log(err))

	res.status(200)
	res.json({message: 'Deleted place.'})
}

module.exports = { findPlaceById, findPlacesByUserId, createPlace, updatePlace, deletePlace }