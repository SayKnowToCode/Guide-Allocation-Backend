const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    teamName: {
        type: String,
        required: true, 
        unique: true // Ensure team names are unique
        // But this unique is case sensitive, we need to handle this
    },
    membersList: [ {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required : true,
            default: "student@email.com"
        },
        UID: {
            type: Number,       
        },
        password: {
            type: String,
            required: true,
            default: "empty"
        },
        branch: {
            type: String,  
        },
        isTeamLeader: {
            type: Boolean,
            default: false
        },
        registerationFinal: {
            type: Boolean,
            default: false
        }
    } ] ,
    guides : {type: [String]},
    acceptedGuides: {type: [String]}

});

module.exports = mongoose.model('Student', userSchema)