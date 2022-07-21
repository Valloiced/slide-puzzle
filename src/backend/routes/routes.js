const app      =  require('express')()
const path     = require('path');


app.get('/explore', (req, res) => {
    res.sendFile(path.join(process.cwd() + "/dist/landing.html"))
})

module.exports = app;