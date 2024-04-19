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
app.use('/sendGuideRequest', require('./routes/sendGuideRequest'));
app.use('/acceptByGuide', require('./routes/acceptByGuide'));
app.use('/rejectByGuide', require('./routes/rejectByGuide'));
app.use('/externalGuide', require('./routes/externalGuide'));

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    server.listen(PORT, () => {
        console.log("SERVER RUNNING");
    });
});

