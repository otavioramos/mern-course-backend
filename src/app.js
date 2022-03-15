const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')

const HttpError = require('./models/http-error')
const { uploadDestination } = require('./middlewares/file-upload')
const placeRoutes = require('./routes/place-routes')
const userRoutes = require('./routes/user-routes')

const PORT = 5000
const app = express()
app.use(express.json())

app.use('/uploads/images', express.static(uploadDestination))

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	)
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
	next()
})

app.use('/api/place', placeRoutes)
app.use('/api/user/', userRoutes)

app.use((req, res, next) => {
	const error = new HttpError('Could not find this route', 404)
	return next(error)
})

// If any route raise an error, this middleware will catch the error
app.use((error, req, res, next) => {
	if (req.file) {
		fs.unlink(req.file.path, err => {
			console.error(err)
		})
	}

	// Verify if response was sent already
	if (res.headerSent) {
		return next(error)
	}
	res.status(typeof error.code === 'number' ? error.code : 500)
	res.json({ message: error.message || 'An unknown error occured!' })
})

mongoose
	.connect(
		'mongodb://localhost:27017,localhost:27018,localhost:27019/mern?replicaSet=rs'
	)
	.then(() => {
		// Starts the http server (backend) only if the connection to mongodb was successful
		app.listen(PORT, () => console.log(`Server is up on port ${PORT}`))
	})
	.catch((error) => console.error(error))
