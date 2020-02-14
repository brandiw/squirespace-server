let bcrypt = require('bcryptjs')
let mongoose = require('mongoose')

let matchSchema = new mongoose.Schema({
  matchedUser: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId
  },
  swipe: {
    type: String,
    default: 'Unmatched'
  }
})

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  type: {
    type: String,
    default: 'Squire'
  },
  pigeon: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  age: Number,
  pigeon_cage_key: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 100
  },
  bio: String,
  pic: String,
  seeking: String,
  matches: [matchSchema]
})

// Use bcrypt to hash pigeon_cage_key
userSchema.pre('save', function (next) {
  if (this.isNew) {
    // New, as opposed to modified
    this.pigeon_cage_key = bcrypt.hashSync(this.pigeon_cage_key, 12)
  }
  next()
})

// Ensure that pigeon_cage_key doesn't get sent with the rest of the data
userSchema.set('toJSON', {
  transform: (doc, user) => {
    delete user.pigeon_cage_key
    delete user.__v
    return user
  }
})

// Create a helper function to compare the pigeon_cage_key hashes
userSchema.methods.isValidCageKey = function (typedpigeon_cage_key) {
  return bcrypt.compareSync(typedpigeon_cage_key, this.pigeon_cage_key)
}

module.exports = mongoose.model('User', userSchema)
