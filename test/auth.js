let request = require('supertest-as-promised');
const api = require('../app');
const mongoose = require('mongoose');
const config = require('../lib/config/index');
const chai = require('chai');

const host = api;
let expect = chai.expect;
request = request(host)

describe('Ruta para los auth', () => {
    before(() => {
        mongoose.connect(config.database);
    });

    after((done) => {
        mongoose.disconnect(done);
        mongoose.models = {}
    });

    describe('Post', () => {
        it('Deberia autenticar usuarios', (done) => {
            let usuario = {
                'nombre': 'Bruno',
                'apellido': 'Esparza',
                'username': 'baesparza',
                'password': '12345',
            }

            let user_auth = {
                'username': 'baesparza',
                'password': '12345',
            }

            request
                .post('/users')
                .set('Accept', 'application/json')
                .send(usuario)
                .expect(201)
                .expect('Content-Type', /application\/json/)
                .then((res) => {
                    return request
                        .post('/auth')
                        .set('Accept', 'application/json')
                        .send(user_auth)
                        .expect(201)
                        .expect('Content-Type', /application\/json/)
                        .then((res) => {
                            let body = res.body;
                            // console.log(body);
                            expect(body).to.have.property('token');
                            done()
                        }, done);
                }, done);
        });
    });
});