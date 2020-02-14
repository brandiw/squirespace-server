let db = require('../models')
let router = require('express').Router()

router.get('/', (req, res) => {
  console.log('getting matches for', req.user._id)
  db.Match.find({
    user: req.user._id
  })
  .populate('matched')
  .then(matches => {
    console.log('success', matches)
    res.send({ matches })
  })
  .catch(err => {
    res.status(500).send({ matches: [] })
  })
})

// Make matches?
router.post('/', (req, res) => {
  console.log('matches post route', req.body)
  // Update matches
  db.Match.create({
    user: req.user._id,
    matched: req.body.matchedUser,
    swipe: req.body.swipe
  })
  .then(() => {
    console.log('success')
    res.send({ message: 'Success' })
  })
  .catch(err => {
    console.log('err', err)
    res.status(500).send({ message: 'Ugh this pigeon is stuck in the fence'})
  })
})

router.get('/potentials', (req, res) => {
  console.log('getting potential matches for', req.user._id)
  db.User.find({
    user: {$ne: req.user._id}
  })
  .then(users => {
    console.log('success', users)
    res.send({ users })
  })
  .catch(err => {
    console.log(err)
    res.status(500).send({ users: [] })
  })
})

module.exports = router
