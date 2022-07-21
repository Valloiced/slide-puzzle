require('dotenv').config();
const express       = require('express');
const session       = require('express-session');
const passport      = require('passport');

/** Routes */
const protectedRoutes    = require('./routes/protectedRoutes');
const authRoutes         = require('./routes/authRoutes');
const routes             = require('./routes/routes')

/** Store  */
const MongoStore    = require('connect-mongo');

/** Env  */
const DEVDB = process.env.MONGO_LOCAL
const URI   = process.env.MONGO_URI
const PORT  = process.env.PORT || 3000

const app   = express();

app.use(express.static('dist'));
app.use(express.json());

/** Session Setup */
const store = MongoStore.create({
    mongoUrl: URI
})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}))

/** Passport Setup */

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());


/** Additional Helper */
const { ensureAuthenticated }= require('./controllers/customMiddlewares')

/** Routes */

app.use(authRoutes);
app.use(routes);
app.use(ensureAuthenticated);
app.use(protectedRoutes);


app.listen(PORT, () => console.log(`App is listening at Port ${PORT}`));