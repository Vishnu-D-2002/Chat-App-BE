const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoDB_URL, PORT } = require('./utils');
const userRouter = require('./Routes/userRoute');

const app = express();

mongoose.set('strictQuery', false);

console.log('Connecting to MongoDB...');

mongoose.connect(MongoDB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running in http://localhost:${PORT}`);
        })
    });

app.use(cors());
app.use(express.json());

app.use('/', userRouter);