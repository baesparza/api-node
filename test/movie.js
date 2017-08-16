let request = require('supertest-as-promised');
const api = require('../app');
const host = api;
let chai = require('chai');

let expect = chai.expect;
request = request(host)

describe('La ruta de peliculas', () => {
    describe('Una peticion post', () => {
        it('Deberia crear una pelicula', (done) => {
            let movie = {
                'title': 'El lobo de Wall Street',
                'year': '2013'
            }

            request
                .post('/movie')
                .set('Accept', 'application/json')
                .send(movie)
                .expect(201)
                .expect('Content-Type', /application\/json/)
                .end((err, res) => {
                    let body = res.body;

                    expect(body).to.have.property('movie');
                    movie = body.movie;

                    expect(movie).to.have.property('title', 'El lobo de Wall Street');
                    expect(movie).to.have.property('year', '2013');
                    expect(movie).to.have.property('_id');

                    done(err);
                });
        });
    });
});