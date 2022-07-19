const express  = require('express');
const path     = require('path');
const passport = require('passport');

const app = express()

app.get('/explore', (req, res) => {
    res.sendFile(path.join(process.cwd() + "/dist/main.html"))
})

module.exports = app



