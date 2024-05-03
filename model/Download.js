const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    fileData: Buffer
});

const Download = mongoose.model('Download', downloadSchema);

module.exports = Download;