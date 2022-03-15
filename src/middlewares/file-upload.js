const multer = require('multer')
const { v4: uuid } = require('uuid')
const path = require('path')
const fs = require('fs')


const uploadDestination = path.join('uploads','images')

const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpeg',
	'image/jpg': 'jpg'
}

const fileUpload = multer({
	limits: 500000,
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			fs.mkdir(uploadDestination, { recursive: true }, err => {
				if (err) {
					console.error(err)
				}
				cb(null, uploadDestination)
			})
		},
		filename: (req, file, cb) => {
			const ext = MIME_TYPE_MAP[file.mimetype]
			cb(null, uuid() + '.' + ext)
		}
	}),
	fileFilter: (req, file, cb) => {
		// !! converts data to true and undefined to false
		const isValid = !!MIME_TYPE_MAP[file.mimetype]
		let error = isValid ? null : new Error('Invalid mime type!')
		cb(error, isValid)
	}
})

module.exports = { fileUpload, uploadDestination }