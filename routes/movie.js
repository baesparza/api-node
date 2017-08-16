var express = require('express');
var router = express.Router();

var db = {}

router.post('/', function (req, res, next) {
    // console.log('[/movies] POST:', req.body)
    if (!req.body) {
        res.status(403)
            .json({ error: true, message: 'Empty post' });
    }
    let _movie = req.body;
    _movie._id = Date.now();

    db[_movie._id] = _movie;

    res.status(201)
    .json({movie: db[_movie._id]});
});

module.exports = router;
