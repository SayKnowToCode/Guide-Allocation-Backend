const mongoose = require('mongoose');
const Schema = mongoose.Schema

const guideSchema = new Schema ({
    name : {
        type : String
    },
    email : {
        type : String
    },
    department : {
        type : String
    },
    designation : {
        type : String
    },
    domains : {
        type : [String]
    },
    count : {
        type : Number
    },
    required: ["name", "email", "domains", "count"]
})

module.exports = mongoose.model('Guide', guideSchema)