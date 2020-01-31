const request = require('supertest');
const { app } = require('../handlers.js');
const sinon = require('sinon');
const fs = require('fs');

describe('GET', function () {
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

    it('should get the home page when /home.html', function (done) {
      request(app.serve.bind(app))
        .get('/home.html')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'text/html')
        .expect('Content-Length', '911')
        .expect(/Flower Catalog/, done);
    });
  });

  describe('not found page', function () {
    it('should get the not found page', function (done) {
      request(app.serve.bind(app))
        .get('/bad')
        .set('Accept', '*/*')
        .expect(404)
        .expect(/Not Found/, done);
    });
  });

  describe('guest book page', function () {
    it('should get the not found page', function (done) {
      request(app.serve.bind(app))
        .get('/guest_book.html')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'text/html')
        .expect(/Guest book/, done);
    });
  });

  describe('abeliophyllum page', function () {
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

  describe('ageratum page', function () {
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
});

describe('POST', function () {
  beforeEach(() => sinon.replace(fs, 'writeFileSync', () => { }));
  afterEach(() => sinon.restore());

  describe('/saveComment', function () {
    it('should redirect to the guest book page', function (done) {
      request(app.serve.bind(app))
        .post('/saveComment')
        .send('name=sai&&comment=good morning')
        .expect(301, done);
    });
  });

  describe('/bad', function () {
    it('should redirect to the guest book page', function (done) {
      request(app.serve.bind(app))
        .post('/bad')
        .send('name=sai&&comment=good morning')
        .expect(404, done);
    });
  });
});
