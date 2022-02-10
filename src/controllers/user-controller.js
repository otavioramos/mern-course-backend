const HttpError = require("../models/http-error");
const { v4 } = require('uuid');

const DUMMY_USERS = [
    {
        id: "u1",
        name: "Otavio",
        image:
            "https://upload.wikimedia.org/wikipedia/commons/e/e8/Lc3_2018_%28263682303%29_%28cropped%29.jpeg",
        email: 'teste@teste.com',
        password: '123456789',
        places: [
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
            }
        ],
    }
];

function getAllUsers(req, res, next) {
    res.status(200).json({users: DUMMY_USERS});
}

function signupUser(req, res, next) {
    const { name, email, password } = req.body;
    const userId = v4();
    DUMMY_USERS.push({
        id: userId,
        name,
        email,
        password
    });
    // login
    const user = DUMMY_USERS.find( user => user.id === userId);
    res.status(201).json(user);
}

function logInUser(req, res, next) {
    const { email, password } = req.body;
    const userByEmail = DUMMY_USERS.find( user => user.email === email);
    if (!userByEmail || userByEmail.password !== password) {
        return next(
            new HttpError("Could not identify user, credentials seem to be wrong.", 401)
          );
    }
    res.status(200).json({message: 'Login success.'})
}

module.exports = { getAllUsers, signupUser, logInUser }