let request = require('supertest-as-promised');
const api = require('../app');
const host = api;
const chai = require('chai');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('../lib/config/index');

let expect = chai.expect;
request = request(host)

describe('La ruta de peliculas', () => {
    before(() => {
        mongoose.connect(config.database);
    });

    after((done) => {
        mongoose.disconnect(done);
        mongoose.models = {}
    })

    /* post a movie */
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

    /* get all movies */
    describe('Una peticion get', () => {
        it('Deberia obtener todas las peliculas', (done) => {
            let movie = {
                'title': 'El lobo de Wall Street',
                'year': '2013'
            }
            let movie2 = {
                'title': 'Jobs',
                'year': '2017'
            }
            let movie_id = 0;
            let movie2_id = 0;

            request
                // post the first movie
                .post('/movie')
                .set('Accept', 'application/json')
                .send(movie)
                .expect(201)
                .expect('Content-Type', /application\/json/)
                .then((res) => {
                    // send the secon movie
                    movie_id = res.body.movie._id;
                    return request
                        .post('/movie')
                        .set('Accept', 'application/json')
                        .send(movie2)
                        .expect(201)
                        .expect('Content-Type', /application\/json/)
                }).then((res) => {
                    // get all the movies
                    movie2_id = res.body.movie._id;
                    return request
                        .get('/movie')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
                }, done).then((res) => {
                    // get response
                    let body = res.body;

                    expect(body).to.have.property('movies');
                    expect(body.movies).to.be.an('array').and.to.have.length.above(2);

                    let movies = body.movies;
                    movie = _.find(movies, { _id: movie_id })
                    movie2 = _.find(movies, { _id: movie2_id })
                    // espectations movie 1
                    expect(movie).to.have.property('title', 'El lobo de Wall Street');
                    expect(movie).to.have.property('year', '2013');
                    expect(movie).to.have.property('_id', movie_id);
                    // espectations movie 2
                    expect(movie2).to.have.property('title', 'Jobs');
                    expect(movie2).to.have.property('year', '2017');
                    expect(movie2).to.have.property('_id', movie2_id);

                    done();
                }, done);
        });
    });

    describe('Obtener uns pelicula por su id', () => {
        it('Deberia obtener una pelicula', (done) => {
            let movie_id = 0;
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
                .then((res) => {
                    movie_id = res.body.movie._id;
                    return request
                        .get(`/movie/${movie_id}`)
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
                }, done).then((res) => {
                    let body = res.body;

                    expect(body).to.have.property('movie');
                    let movie = body.movie;

                    expect(movie).to.have.property('_id', movie_id);
                    expect(movie).to.have.property('title', 'El lobo de Wall Street');
                    expect(movie).to.have.property('year', '2013');

                    done();
                }, done);
        });
    });

    describe('Una peticion put', () => {
        it('Deberia modificar una pelicula', (done) => {
            let movie_id = 0;
            let movie = {
                'title': 'The wolf of Wall Street',
                'year': '2000'
            }
            let movie_correcta = {
                'title': 'The wolf of Wall Street',
                'year': '2013'
            }

            request
                .post('/movie')
                .set('Accept', 'application/json')
                .send(movie)
                .expect(201)
                .expect('Content-Type', /application\/json/)
                .then((res) => {
                    movie_id = res.body.movie._id;
                    return request
                        .put(`/movie/${movie_id}`)
                        .send(movie_correcta)
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
                }, done).then((res) => {
                    let body = res.body;

                    expect(body).to.have.property('movie');
                    let movie = body.movie;

                    expect(movie).to.have.property('_id', movie_id);
                    expect(movie).to.have.property('title', 'The wolf of Wall Street');
                    expect(movie).to.have.property('year', '2013');

                    done();
                }, done);
        });
    });

    describe('Elimina una pelicula', () => {
        it('deberia eliminar una pelicula por su id', (done) => {
            let movie_id = 0;
            let movie = {
                'title': 'The wolf of Wall Street',
                'year': '2013'
            }

            request
                .post('/movie')
                .set('Accept', 'application/json')
                .send(movie)
                .expect(201)
                .expect('Content-Type', /application\/json/)
                .then((res) => {
                    movie_id = res.body.movie._id;
                    return request
                        .delete(`/movie/${movie_id}`)
                        .set('Accept', 'application/json')
                        .expect(400)
                        .expect('Content-Type', /application\/json/)
                }, done).then((res) => {
                    let body = res.body;

                    expect(body).to.be.empty;

                    done();
                }, done);
        });
    });
});