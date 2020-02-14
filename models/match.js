let mongoose = require('mongoose')

let matchSchema = new mongoose.Schema({
    user: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    },
    matched: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    },
    swipe: {
        type: String,
        default: 'Unmatched'
    }
})

module.exports = mongoose.model('Match', matchSchema)