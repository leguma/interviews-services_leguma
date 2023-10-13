const request = require('supertest');
const { app } = require('./app');

describe('GET /', () => {
  test('It should response the GET method', () => request(app)
    .get('/')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});

describe('GET /api/tree', () => {
  test('It should response the GET method', () => request(app)
    .get('/api/tree')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});

describe('POST /api/tree', () => {
  test('It should response the POST method', () => request(app)
    .post('/api/tree')
    .send({ id: 'root', label: 'root' })
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
  test('It should response the POST method for children', () => request(app)
    .post('/api/tree')
    .send({ parent: 'root', label: 'child' })
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
  test('It should return a 404 for missing parents', () => request(app)
    .post('/api/tree')
    .send({ parent: 'bad', label: 'test' })
    .then((response) => {
      expect(response.statusCode).toBe(404);
    }));
  test('It should return a 400 for a missing label', () => request(app)
    .post('/api/tree')
    .send({ })
    .then((response) => {
      expect(response.statusCode).toBe(400);
    }));
});
