require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const port = 3000 || process.env.PORT;

app.use(
  session({
    secret: '7sD8fG2hJ4kL1pQ9rZ0xY6vA3tE5uB',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

const routes = require('./server/routes/routes');
const dashboardRoutes = require('./server/routes/dashboard');
const auth = require('./server/routes/auth');

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//connecting to database
connectDB();

//static files
app.use(express.static('public'));

//templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//routes
app.use('/', auth);
app.use('/', routes);
app.use('/', dashboardRoutes);

//handle 404
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
