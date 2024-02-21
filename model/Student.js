const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    teamName: {
        type: String,
        required: [true, "Please enter team name"],
        unique: true // Ensure team names are unique
        // But this unique is case sensitive, we need to handle this
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
    },
    membersList: [ {
        name: {
            type: String,
            required: true
        },
        UID: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        isTeamLeader: {
            type: Boolean,
            default: false
        }
    } ]     
});

module.exports = mongoose.model('Student', userSchema)