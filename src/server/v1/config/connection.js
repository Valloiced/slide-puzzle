require('dotenv').config()
const mongoose = require('mongoose');

const DEVDB = process.env.MONGO_LOCAL
const URI = process.env.MONGO_URI

const dbConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

/* Dev */
// const connection = mongoose.connect(DEVDB, dbConfig);

/* Main */
const connection = mongoose.connect(URI, dbConfig, () => {
    console.log('Connected to Database')
});

module.exports.connection = { connection }
