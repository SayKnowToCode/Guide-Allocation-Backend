require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Submission = require('./model/Submission');
const Download = require('./model/Download');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT"],
    },
});


connectDB();
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const emitChanges = (endpoint, payload) => {
    io.emit(endpoint, payload);
}

app.use((req, res, next) => {
    req.emitChanges = emitChanges;
    next();
});

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/profList', require('./routes/profList'));
app.use('/getTeam', require('./routes/getTeam'));
app.use('/setDate', require('./routes/setDate'));
app.use('/getDate', require('./routes/getDate'));
app.use('/sendGuideRequest', require('./routes/sendGuideRequest'));
app.use('/acceptByGuide', require('./routes/acceptByGuide'));
app.use('/rejectByGuide', require('./routes/rejectByGuide'));
app.use('/externalGuide', require('./routes/externalGuide'));
app.use('/evaluation', require('./routes/evaluation'));

const storage = multer.memoryStorage(); // Use memory storage instead of disk storage

const upload = multer({ storage: storage });

app.post('/submissions', upload.single('file'), async (req, res) => {
    console.log('File uploaded');
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const { teamName, facultyName, fileName } = req.body;

    try {
        const check = await Submission.findOne({ to: facultyName, from: teamName });
        if (check) {
            check.submissions.push({
                fileName: fileName,
                fileData: file.buffer // Store file data as a Buffer
            });
            await check.save();
            console.log('Submission updated successfully');
            res.status(200).json({ message: 'Submission saved successfully' });
        } else {
            const submission = new Submission({
                to: facultyName,
                from: teamName,
                submissions: [{
                    fileName: fileName,
                    fileData: file.buffer // Store file data as a Buffer
                }]
            });
            await submission.save();
            console.log('Submission saved successfully');
            res.status(200).json({ message: 'Submission saved successfully' });
        }
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/docs', upload.single('file'), async (req, res) => {
    console.log('File uploaded');
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const { fileName } = req.body;

    try {
        const check = await Download.findOne({ fileName: fileName });
        if (check) {
            console.log('Doc already present');
            res.status(200).json({ message: 'Doc already present' });
        } else {
            const download = new Download({
                fileName: fileName,
                fileData: file.buffer // Store file data as a Buffer
            });
            await download.save();
            console.log('Download saved successfully');
            res.status(200).json({ message: 'Download saved successfully' });
        }
    } catch (error) {
        console.error('Error saving download:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/fetchSubmissions', async (req, res) => {
    console.log('Fetching submissions');
    const { teamName, facultyName } = req.query;
    try {
        const submission = await Submission.findOne({ to: facultyName, from: teamName });
        const filesArray = submission.submissions.map(submission => ({
            fileName: submission.fileName,
            fileData: submission.fileData
        }));
        res.set('Content-Type', 'application/json'); // Set appropriate content type
        res.send(filesArray);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/download/:fileName', async (req, res) => {

    const { fileName } = req.params;

    try {
        const download = await Download.findOne({ fileName: fileName });
        if (!download) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.set('Content-Type', 'application/json');
        res.send(download);
    }
    catch (error) {
        console.error('Error fetching download:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    server.listen(PORT, () => {
        console.log("SERVER RUNNING");
    });
});

