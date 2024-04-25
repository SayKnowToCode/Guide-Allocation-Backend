const mongoose = require('mongoose');
const Schema = mongoose.Schema

const dateSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Date', dateSchema)