let db = require('../models')
let router = require('express').Router()

router.get('/', (req, res) => {
  res.send({ dogs: req.user.dogs })
})

// Make matches?
router.post('/', (req, res) => {
  console.log('matches post route', req.body)
  // First get the user from the DB using the id in req.user
  db.User.findOne(req.user.id)
  .then(user => {
    // Update matches

    // Save the changes to the DB
    user.save().then(() => {
      res.send({ matches: user.matches })
    })
    .catch(err => {
      console.log('Aww suck', err)
      res.status(503).send({ message: 'Error saving document' })
    })
  })
  .catch(err => {
    console.log('Server error', err)
    res.status(500).send({ message: 'Server error' })
  })
})

module.exports = router
