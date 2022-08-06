const express = require('express');
const { ensureAuthenticated } = require('../libs/handlerUtils');

const { 
    authControllers,
    viewsControllers,
    dataControllers,
    landingControllers,
    userControllers,
    userPuzzlesControllers,
    gameControllers
} 
= require('../controllers')

const app = express()

app.use(viewsControllers)
app.use(authControllers)
app.use('/data', dataControllers)
app.use('/explore', landingControllers)
app.use('/your-puzzles', ensureAuthenticated, userPuzzlesControllers)
app.use('/home', ensureAuthenticated, userControllers)
app.use('/game', gameControllers)

module.exports = app