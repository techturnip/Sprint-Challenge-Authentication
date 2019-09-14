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
    it('should return correct object', () => {
      return request(server)
        .post('/api/auth/register')
        .send({ username: 'testUser2', password: 'testPass2' })
        .then(res => {
          expect(typeof res.body).toBe('object')
          expect(res.body.user.username).toBe('testUser2')
          // check if a token exists
          expect(res.body.token).toEqual(expect.anything())
        })
    })
  })

  describe('POST /login', () => {
    it('succeeds with correct credentials', async () => {
      const testUser = { username: 'testUser', password: 'testPass' }
      await request(server)
        .post('/api/auth/register')
        .send(testUser)

      const res = await request(server)
        .post('/api/auth/login')
        .send(testUser)

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Welcome testUser')
    })
    it('fails with invalid credentials', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'wrongUsername', password: 'wrongPassword' })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Invalid Credentials')
    })
  })
})
