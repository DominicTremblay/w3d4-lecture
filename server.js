const express = require('express');
const morgan = require('morgan');

const cookieSession = require('cookie-session')
const { createNewQuote, updateQuote } = require('./helpers/dbHelpers');
const authenticateRoutes = require('./routes/authenticate');
const saltRounds = 10;
const bcrypt = require('bcrypt');
var methodOverride = require('method-override')

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.use(methodOverride('_method'))

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Static assets (images, css files) are being served from the public folder
app.use(express.static('public'));

// Setting ejs as the template engine
app.set('view engine', 'ejs');

// In memory database
const movieQuotesDb = {
  d9424e04: {
    id: 'd9424e04',
    quote: 'Why so serious?',
  },
  '27b03e95': {
    id: '27b03e95',
    quote: 'YOU SHALL NOT PASS!',
  },
  '5b2cdbcb': {
    id: '5b2cdbcb',
    quote: "It's called a hustle, sweetheart.",
  },
  '917d445c': {
    id: '917d445c',
    quote: 'The greatest teacher, failure is.',
  },
  '4ad11feb': {
    id: '4ad11feb',
    quote: 'Speak Friend and Enter',
  },
};

const quoteComments = {
  '70fcf8bd': {
    id: '70fcf8bd',
    comment: 'So awesome comment!',
    quoteId: 'd9424e04',
  },
};

const usersDb = {
  1: {
    id: 1,
    name: 'Kent Cook',
    email: 'really.kent.cook@kitchen.com',
    password: bcrypt.hashSync('cookinglessons', saltRounds),
  },
  2: {
    id: 2,
    name: 'Phil A. Mignon',
    email: 'good.philamignon@steak.com',
    password: bcrypt.hashSync('meatlover', saltRounds),
  },
};

// activate the authenticateRoutes => telling express we want to use those routes
app.use('/', authenticateRoutes(usersDb));

// CRUD operations

// List all the quotes
// READ
// GET /quotes

app.get('/quotes', (req, res) => {
  const quoteList = Object.values(movieQuotesDb);

  // get the current user
  // read the user id value from the cookies

  const userId = req.session['user_id'];

  const loggedInUser = usersDb[userId];

  const templateVars = { quotesArr: quoteList, currentUser: loggedInUser };

  res.render('quotes', templateVars);
});

// Display the add quote form
// READ
// GET /quotes/new

app.get('/quotes/new', (req, res) => {
  // get the current user
  // read the user id value from the cookies

  const userId = req.session['user_id'];

  const loggedInUser = usersDb[userId];

  const templateVars = { currentUser: loggedInUser };

  res.render('new_quote', templateVars);
});

// Add a new quote
// CREATE
// POST /quotes

app.post('/quotes', (req, res) => {
  // extract the quote content from the form.
  // content of the form is contained in an object call req.body
  // req.body is given by the bodyParser middleware
  const quoteStr = req.body.quoteContent;

  // Add a new quote in movieQuotesDb

  createNewQuote(quoteStr, movieQuotesDb);

  // redirect to '/quotes'
  res.redirect('/quotes');
});

// Edit a quote

// Display the form
// GET /quotes/:id
app.get('/quotes/:id', (req, res) => {
  const quoteId = req.params.id;
  // get the current user
  // read the user id value from the cookies

  const userId = req.cookies['user_id'];

  const loggedInUser = usersDb[userId];
  const templateVars = {
    quoteObj: movieQuotesDb[quoteId],
    currentUser: loggedInUser,
  };

  // render the show page
  res.render('quote_show', templateVars);
});

// Update the quote in the movieQuotesDb
// PUT /quotes/:id

app.post('/quotes/:id', (req, res) => {
  // Extract the  id from the url
  const quoteId = req.params.id;

  // Extract the content from the form
  const quoteStr = req.body.quoteContent;

  // Update the quote in movieQuotesDb

  updateQuote(quoteId, quoteStr, movieQuotesDb);

  // redirect to '/quotes'
  res.redirect('/quotes');
});

// DELETE
app.delete('/quotes/:id', (req, res) => {
  const quoteId = req.params.id;

  delete movieQuotesDb[quoteId];

  res.redirect('/quotes');
});

// Delete the quote

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
