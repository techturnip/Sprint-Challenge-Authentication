// IMPORTS/INITIALIZATION =========================|
// ================================================|
const request = require('supertest')
const server = require('../api/server.js')
const db = require('../database/dbConfig.js')
// ------------------------------------------------|
// TESTING ========================================|
// ================================================|
describe('the auth router', () => {
  beforeEach(async () => {
    await db('users').truncate()
  })

  describe('POST /register', () => {
    it('responds with json', () => {
      return request(server)
        .post('/api/auth/register')
        .send({ username: 'testUser', password: 'testPass' })
        .then(res => {
          expect(res.type).toBe('application/json')
          expect(res.status).toBe(201)
        })
    })
    it('should return correct object', () => {})
  })
})
