const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../lib/model/user');
const config = require('../lib/config/index');
const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'prueba123';

let decrypt = (text) => {
    let decripher = crypto.createDecipher(algorithm, password);
    let dec = decripher.update(text, 'hex', 'utf8');
    dec += decripher.final('utf8');
    return dec;
}

router.post('/', function (req, res, next) {
    // console.log('[/auth] POST:', req.body)
    if (!req.body) {
        res.status(403)
            .json({ error: true, message: 'Body empty' })
    }
    let _user = req.body;
    User.findOne({ username: _user.username }, (err, user) => {
        if (err) {
            res.status(403)
                .json({ error: true, message: err })
        } else if (user) {
            if (_user.password === decrypt(user.password)) {
                let token = jwt.sign(user, config.secret, {
                    expiresIn: '24hr'
                });
                res.status(201)
                    .json({ token: token })
            } else {
                res.status(403)
                    .json({ error: true, message: 'Contraseña incorrecta' })
            }
         } else {
            res.status(403)
                .json({ error: true, message: 'Usuario no existe' })
        }
    });
});

module.exports = router;
