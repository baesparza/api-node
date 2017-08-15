let request = require('supertest-as-promised');
const api = require('../app');
const host = api;
let chai = require('chai');

let expect = chai.expect;
request = request(host)

describe('Ruta indice, Hola Mundo', () => {
    describe('GET /', () => {
        it('deberia regresar un hola mundo', (done) => {
            request
                .get('/')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .end((err, res) => {
                    let body = res.body;
                    // console.log('[mocha]:', body)
                    expect(body).to.have.property('message', 'hola mundo');
                    done(err);
                });
        });
    });
});