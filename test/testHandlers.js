const request = require('supertest');
const { app } = require('../handlers.js');
const querystring = require('querystring');

describe('GET home page', function () {
  it('should get the home page', function (done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '911')
      .expect(/Flower Catalog/, done);
  });

  it('should get the home page', function (done) {
    request(app.serve.bind(app))
      .get('/home.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '911')
      .expect(/Flower Catalog/, done);
  });
});

describe('GET not found page', function () {
  it('should get the not found page', function (done) {
    request(app.serve.bind(app))
      .get('/bad')
      .set('Accept', '*/*')
      .expect(404)
      .expect(/Not Found/, done);
  });
});

describe('GET  guest book page', function () {
  it('should get the not found page', function (done) {
    request(app.serve.bind(app))
      .get('/guest_book.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(/Guest book/, done);
  });

  it('should redirect to the guest book page', function (done) {
    request(app.serve.bind(app))
      .post('/saveComment')
      .send(querystring.stringify({ name: 'sai', comment: 'good morning' }))
      .expect(301, done);
  });
});

describe('GET abeliophyllum page', function () {
  it('should get the abeliophyllum page', function (done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '911')
      .expect(/abeliophyllum/, done);
  });
});

describe('GET ageratum page', function () {
  it('should get the ageratum page', function (done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '911')
      .expect(/ageratum/, done);
  });
});
