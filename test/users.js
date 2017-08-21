let request = require('supertest-as-promised');
const api = require('../app');
const host = api;
const chai = require('chai');
const mongoose = require('mongoose');
const config = require('../lib/config/index');

let expect = chai.expect;
request = request(host)

describe('Ruta Users', () => {
    before(() => {
        mongoose.connect(config.database);
    });

    after((done) => {
        mongoose.disconnect(done);
        mongoose.models = {}
    });

    describe('Post', () => {
        it.only('Deberia crear un usuario', (done) => {
            let usuario = {
                'nombre': 'Bruno',
                'apellido': 'Esparza',
                'username': 'baesparza',
                'password': '12345',
            }

            request
                .post('/users')
                .set('Accept', 'application/json')
                .send(usuario)
                .expect(201)
                .expect('Content-Type', /application\/json/)
                .end((err, res) => {
                    let body = res.body;
                    // console.log('[mocha]:', body)
                    expect(body).to.have.property('user');
                    let _user = body.user;
                    expect(_user).to.have.property('nombre', 'Bruno')
                    expect(_user).to.have.property('apellido', 'Esparza')
                    expect(_user).to.have.property('username', 'baesparza')
                    expect(_user).to.have.property('password')
                    done(err)
                });
        });
    });
});