const mongoose = require('mongoose');
const Schema = mongoose.Schema

const guideSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String
        // required : true
    },
    email: {
        type: String,
        required: true
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    domains: {
        type: [String],
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    teams: {
        type: [String]
    },
    acceptedTeams: [{
        teamName: {
            type: String
        },
        phase1Marks: {
            type: Number
        },
        phase2Marks: {
            type: Number
        },
        phase3Marks: {
            type: Number
        }
    }],
    teamsAllocatedByMe: [{
        teamName: {
            type: String
        },
        allocatedTo: {
            type: String
        }
    }],
    teamsAllocatedToMe: [{
        teamName: {
            type: String
        },
        allocatedBy: {
            type: String
        },
        phase1Marks: {
            type: Number
        },
        phase2Marks: {
            type: Number
        },
        phase3Marks: {
            type: Number
        }
    }]

})

module.exports = mongoose.model('Guide', guideSchema)