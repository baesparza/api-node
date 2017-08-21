const mongoose = require('mongoose');

const UserScheema = new mongoose.Schema({
    nombre: { type: String, require: true },
    apellido: { type: String, require: true },
    username: { type: String, require: true, index: { unique: true } },
    password: { type: String, require: true }
});

module.exports = mongoose.model('User', UserScheema);
