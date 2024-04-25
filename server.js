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
app.use('/sendGuideRequest', require('./routes/sendGuideRequest'));
app.use('/acceptByGuide', require('./routes/acceptByGuide'));
app.use('/rejectByGuide', require('./routes/rejectByGuide'));
app.use('/externalGuide', require('./routes/externalGuide'));
app.use('/evaluation', require('./routes/evaluation'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    const { facultyName, teamName } = req.body;
    const data = {
        teamName,
        fileName: req.file.filename
    }
    req.emitChanges(`fileUploadedFor${facultyName}`, data);
    res.status(200).json({ message: 'File uploaded successfully' });
});

// Serve the uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    server.listen(PORT, () => {
        console.log("SERVER RUNNING");
    });
});

