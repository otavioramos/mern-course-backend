const HttpError = require('../models/http-error');
const { v4 } = require('uuid');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Otavio',
        image:
            'https://upload.wikimedia.org/wikipedia/commons/e/e8/Lc3_2018_%28263682303%29_%28cropped%29.jpeg',
        email: 'teste@teste.com',
        password: '123456789',
        places: [
            {
                id: 'p1',
                title: 'Empire State Building',
                description: 'One of the most famous sky scrapers in the world',
                location: {
                    lat: 40.7484405,
                    lng: -73.9878531,
                },
                address: '20 W 34th St, New York, NY 10001',
                creator: 'u1',
            }
        ],
    }
];

function getAllUsers(req, res, next) {
    res.status(200).json({users: DUMMY_USERS});
}

async function signupUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { name, email, password, places } = req.body;
    
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email});
    } catch(err) {
        const error = new HttpError('Signing up failed, please try again later.', 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User exists already, please login instead.', 422);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Lc3_2018_%28263682303%29_%28cropped%29.jpeg',
        password,
        places
    });

    try {
        await createdUser.save();
    } catch(err) {
        const error = new HttpError('Signing up failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({getters:true})});
}

async function logInUser(req, res, next) {
    const { email, password } = req.body;
   
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch(err) {
        const error = new HttpError('Logging in failed, please try again later.', 500);
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError('Invalid  credentials, could not log you in.',401);
        return next(error);
    }

    res.status(200).json({message: 'Login success.'})
}

module.exports = { getAllUsers, signupUser, logInUser }