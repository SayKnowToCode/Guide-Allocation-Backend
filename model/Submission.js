const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    submissions: [{
        fileData: Buffer,
        fileName: {
            type: String,
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;