const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const { movieQuotesDb, quoteComments, usersDb } = require('./db/db');
const {
  createNewQuote,
  updateQuote,
  authenticateUser,
  findUserByEmail,
  addNewUser,
  getQuoteList,
  getMovieQuote,
  deleteMovieQuote
} = require('./helpers/dbHelpers')({ movieQuotesDb, quoteComments, usersDb });

const quoteRoutes = require('./routes/quotes_routes');

const PORT = process.env.PORT || 3005;

// creating an Express app
const app = express();

// app.use(cookieParser());

app.use(
  cookieSession({
    name: 'session',
    keys: ['b73eeab0-949d-4a0e-ab15-db304afbcb6e', 'key2'],
  })
);

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Static assets (images, css files) are being served from the public folder
app.use(express.static('public'));

// Setting ejs as the template engine
app.set('view engine', 'ejs');

// Activating the routes
app.use(
  '/quotes',
  quoteRoutes({
    createNewQuote,
    updateQuote,
    authenticateUser,
    findUserByEmail,
    addNewUser,
    getQuoteList,
    getMovieQuote,
    deleteMovieQuote
  })
);

const currentUser = (req, res, next) => {
  req.currentUser = req.session['user_id'];
  next();
};

app.use(currentUser);

// Authentication

// Display the register form
app.get('/register', (req, res) => {
  const templateVars = { currentUser: null };
  res.render('register', templateVars);
});

// Get the info from the register form
app.post('/register', (req, res) => {
  // extract the info from the form
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // check if the user is not already in the database

  const user = findUserByEmail(email);

  // if not in the db, it'ok to add the user to the db

  if (!user) {
    const userId = addNewUser(name, email, password);
    // setCookie with the user id
    req.session['user_id'] = userId;

    // redirect to /quotes
    res.redirect('/quotes');
  } else {
    res.status(403).send('Sorry, the user is already registered');
  }
});

// Display the login form
app.get('/login', (req, res) => {
  const templateVars = { currentUser: null };
  res.render('login', templateVars);
});

// this end point is for checking the content of usersDb
// remove when cleaning up the code
app.get('/users', (req, res) => {
  res.json(usersDb);
});

// Authenticate the user
app.post('/login', (req, res) => {
  // extract the info from the form
  const email = req.body.email;
  const password = req.body.password;

  // Authenticate the user
  const user = authenticateUser(email, password);

  // if authenticated, set cookie with its user id and redirect
  if (user) {
    req.session['user_id'] = user.id;
    res.redirect('/quotes');
  } else {
    // otherwise we send an error message
    res.status(401).send('Wrong credentials!');
  }
});

app.post('/logout', (req, res) => {
  // clear the cookies
  res.cookie('user_id', null);

  // redirect to /quotes
  res.redirect('/quotes');
});

// Delete the quote

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
