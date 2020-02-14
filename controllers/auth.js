require('dotenv').config()
let db = require('../models')
let jwt = require('jsonwebtoken')
let router = require('express').Router()

// POST /auth/login (find and validate user; send token)
router.post('/login', (req, res) => {
  console.log(req.body)
  // Find the user
  db.User.findOne({ pigeon: req.body.pigeon })
  .then(user => {
    // Make sure the user exists and has a password
    if (!user || !user.pigeon_cage_key) {
      return res.status(404).send({ message: 'Sorry, but your pigeon is in another castle...' })
    }

    // Good - they exist. Now we check the password
    if (!user.isValidCageKey(req.body.pigeon_cage_key)) {
      return res.status(401).send({ message: 'Pigeon blown away in storm' })
    }

    // Good user - issue a token and send it
    let token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 8 // 8 hours in seconds
    })
    res.send({ token })
  })
  .catch(err => {
    console.log('Error in POST /auth/login', err)
    res.status(503).send({ message: 'Pigeon is asleep' })
  })
})

// POST to /auth/signup (create user; generate token)
router.post('/signup', (req, res) => {
  console.log(req.body)
  // Look up the user (make sure they aren't a duplicate)
  db.User.findOne({ pigeon: req.body.pigeon })
  .then(user => {
    // If the user exists, do NOT let them create another account!
    if (user) {
      // Bad - this is signup, they shouldn't already exist
      return res.status(409).send({ message: 'Pigeon already in use!' })
    }

    // Good - the user doesn't exist :)
    db.User.create(req.body)
    .then(newUser => {
      // Cool - I have a user. Now I need to make them a token!
      let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 8 // 8 hours in seconds
      })

      // Send that token
      res.send({ token })
    })
    .catch(err => {
      console.log('Error when creating user', err)
      if (err.name === 'ValidationError') {
        res.status(406).send({ message: 'Validation error!' })
      }
      else {
        res.status(500).send({ message: 'Error creating user' })
      }
    })
  })
  .catch(err => {
    console.log('Error in POST /auth/signup', err)
    res.status(503).send({ message: 'Database or server error' })
  })
})

// NOTE: User should be logged in to access this route
router.get('/profile', (req, res) => {
  // The user is logged in, so req.user should have data!
  // TODO: Anything you want here!

  // NOTE: This is the user data from the time the token was issued
  // WARNING: If you update the user info those changes will not be reflected here
  // To avoid this, reissue a token when you update user data
  res.send({ message: 'Secret message for pigeon owners ONLY!' })
})

module.exports = router
