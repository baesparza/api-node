const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../lib/model/user');
const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'prueba123';

let encrypt = (text) => {
    let cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

let decrypt = (text) => {
    let decripher = crypto.createDecipher(algorithm, password);
    let dec = decripher.update(text, 'hex', 'utf8');
    dec += decripher.final('utf8');
    return dec;
}

router.post('/', function (req, res, next) {
    // console.log('[/users] POST:', req.body)
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
                res.status(201)
                    .json({ user: user })
            } else {
                res.status(403)
                    .json({ error: true, message: 'Usuario ya existe' })
            }
        } else {
            new User({
                nombre: _user.nombre,
                apellido: _user.apellido,
                username: _user.username,
                password: encrypt(_user.password)
            }).save((err, user) => {
                if (user) {
                    res.status(201)
                        .json({ user: user })
                } else {
                    console.log('[MongoDB]: Error al agregar el usuario', err);
                }
            })
        }
    });
});

module.exports = router;
