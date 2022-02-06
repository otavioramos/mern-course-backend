const express = require('express');

const router = express.Router();

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world',
        location: {
            lat: 40.7484405,
            lng: -73.9878531 
        },
        addres: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
]

router.get('/:placeId', (req, res, next) => {
    const placeId = req.params.placeId;
    const place = DUMMY_PLACES.find(place => place.id === placeId);
    res.json({place});
});

router.get('/user/:userId', (req, res, next) => {
    const userId = req.params.userId;
    const places = DUMMY_PLACES.filter(place => place.creator === userId);
    res.json({places});
});

module.exports = router;