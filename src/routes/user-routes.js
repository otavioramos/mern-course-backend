const express = require('express')
const { check } = require('express-validator')

const {
	getAllUsers,
	signupUser,
	logInUser,
} = require('../controllers/user-controller')
const { fileUpload } = require('../middlewares/file-upload')

const router = express.Router()

router.get('/', getAllUsers)

router.post(
	'/signup',
	fileUpload.single('image'),
	[
		check('name').not().isEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 6 }),
	],
	signupUser
)

router.post('/login', logInUser)

module.exports = router
