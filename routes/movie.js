const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Movie = require('../lib/model/movie');

router.post('/', (req, res, next) => {
    // console.log('[/movie] POST:', req.body)
    if (!req.body) {
        res.status(403)
            .json({ error: true, message: 'Empty post' });
    }

    let _movie = req.body;

    new Movie({
        title: _movie.title,
        year: _movie.year
    }).save((err, movies) => {
        res.status(201)
            .json({ movie: movies });

    });
});

router.get('/', (req, res, next) => {
    // console.log('[/movie] GET')
    Movie.find({}, (err, movies) => {
        if (err) {
            res.status(403)
                .json({ error: true, message: 'bad request' })
        }
        res.status(200)
            .json({ movies: movies })
    });
});

router.get('/:id', (req, res, next) => {
    // console.log(`[/movie/${req.params.id}] GET`)
    if (!req.params.id) {
        res.status(403)
            .json({ error: true, message: 'bad request, empty params:id' })
    }
    Movie.findOne({ _id: req.params.id }, (err, movies) => {
        if (err) {
            res.status(404)
                .json({ error: true, message: 'Movie not found' })
        }
        res.status(200)
            .json({ movie: movies });
    });
});

router.put('/:id', (req, res, next) => {
    // console.log(`[/movie/${req.params.id}] PUT: ${req.body}`)
    if (!req.params.id && !req.body) {
        res.status(403)
            .json({ error: true, message: 'bad request, empty params:id' })
    }
    Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        year: req.body.year
    }, { new: true }, (err, movies) => {
        if (err) {
            res.status(404)
                .json({ error: true, message: 'Movie not found' })
        }
        res.status(200)
            .json({ movie: movies });
    });
});

router.delete('/:id', (req, res, next) => {
    // console.log(`[/movie/${req.params.id}] DELETE`)
    if (!req.params.id) {
        res.status(403)
            .json({ error: true, message: 'bad request, empty params:id' })
    }
    Movie.findByIdAndRemove(req.params.id, (err, movies) => {
        if (err) {
            res.status(404)
                .json({ error: true, message: 'Movie not found' })
        }
        res.status(400)
            .json({});
    });
})

module.exports = router;
