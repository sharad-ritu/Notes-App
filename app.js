require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000 || process.env.PORT;

const routes = require('./server/routes/routes');
const dashboardRoutes = require('./server/routes/dashboard');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static files
app.use(express.static('public'));

//templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//routes
app.use('/', routes);
app.use('/', dashboardRoutes);

//handle 404
app.get('*', (req, res) => {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});