require('dotenv').config();
const express  = require('express');
const path     = require('path');

const app      = express();

app.use(express.static('dist'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist/startup.html"))
})


const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`App is listening at Port ${PORT}`));