require('dotenv').config();

const MongoDB_URL = process.env.MongoDB_URL;
const JWT_SECRET =process.env.JWT_SECRET;
const PORT = process.env.PORT;

module.exports = {
    MongoDB_URL,
    JWT_SECRET,
    PORT
};