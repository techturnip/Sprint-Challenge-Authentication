// IMPORTS/INITIALIZATION =========================|
// ================================================|
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database/dbConfig.js')
// ------------------------------------------------|
// AUTH ENDPOINTS =================================|
// ================================================|
// endpoint base url '/api/auth' ------------------|
// ------------------------------------------------|
router.post('/register', (req, res) => {
  let user = req.body

  if (user.password && user.username) {
    // hash the user password and set on user obj
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash
  } else {
    res.status(401).json({
      message: 'Must include a username & password'
    })
  }

  db('users')
    .insert(user)
    .then(async ids => {
      const newUser = await db('users')
        .where({ id: ids[0] })
        .first()

      const token = generateToken(newUser)

      delete newUser.password

      res.status(201).json({
        user: newUser,
        token
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'failed to register'
      })
    })
})
// ------------------------------------------------|
router.post('/login', (req, res) => {
  let { username, password } = req.body

  db('users')
    .where({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
        res.status(200).json({
          message: `Welcome ${user.username}`,
          token
        })
      } else {
        res.status(401).json({ message: 'Invalid Credentials' })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})
// ------------------------------------------------|
function generateToken(user) {
  // header payload and verify signature
  // payload -> username, id, roles
  const payload = {
    sub: user.id,
    username: user.username
  }

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, process.env.JWT_SECRET, options)
}
// ------------------------------------------------|
// EXPORT ROUTER ==================================|
// ================================================|
module.exports = router
