var _ = require('lodash');
var express = require('express');
var router = express.Router();

var db = {};

router.post('/', (req, res, next) => {
    // console.log('[/movie] POST:', req.body)
    if (!req.body) {
        res.status(403)
            .json({ error: true, message: 'Empty post' });
    }
    let _movie = req.body;
    _movie._id = Date.now();

    db[_movie._id] = _movie;

    res.status(201)
        .json({ movie: db[_movie._id] });
});

router.get('/', (req, res, next) => {
    // console.log('[/movie] GET')
    res.status(200)
        .json({ movies: _.values(db) })
})

router.get('/:id', (req, res, next) => {
    // console.log(`[/movie/${req.params.id}] GET`)
    if (!req.params.id) {
        res.status(403)
            .json({ error: true, message: 'bad request, empty params:id' })
    }
    res.status(200)
        .json({ movie: db[req.params.id] });
});

module.exports = router;
