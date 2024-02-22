const mongoose = require('mongoose');
const Schema = mongoose.Schema

const guideSchema = new Schema ({
    name : {
        type : String
    },
    password : {
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
    teams : {
        type : [String]
    },
    acceptedTeams : {
        type : [String]
    },
    required: ["name", "email", "domains", "count","password"]
})

module.exports = mongoose.model('Guide', guideSchema)