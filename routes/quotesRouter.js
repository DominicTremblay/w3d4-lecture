const express = require('express');
const router = express.Router();
const movieQuotesDb = require('../db/moviesDb');
const { createNewQuote, updateQuote } = require('../helpers/helpersDb'); 


// Routes here

// implied that it's in fact /routes
router.get('/', (req, res) => {
  const quoteList = Object.values(movieQuotesDb);

  const templateVars = { quotesArr: quoteList, currentUser: req.user };

  res.render('quotes', templateVars);
});

// Display the add quote form
// READ
// GET /quotes/new

// /routes/new

router.get('/new', (req, res) => {
  const templateVars = { currentUser: req.user };

  res.render('new_quote', templateVars);
});

// Add a new quote
// CREATE
// POST /quotes

router.post('/', (req, res) => {
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
router.get('/:id', (req, res) => {
  const quoteId = req.params.id;

  const templateVars = {
    quoteObj: movieQuotesDb[quoteId],
    currentUser: req.user,
  };

  // render the show page
  res.render('quote_show', templateVars);
});

// Update the quote in the movieQuotesDb
// PUT /quotes/:id

router.post('/:id', (req, res) => {
  // Extract the  id from the url
  const quoteId = req.params.id;

  // Extract the content from the form
  const quoteStr = req.body.quoteContent;

  // Update the quote in movieQuotesDb

  updateQuote(quoteId, quoteStr);

  // redirect to '/quotes'
  res.redirect('/quotes');
});

// DELETE
router.post('/:id/delete', (req, res) => {
  const quoteId = req.params.id;

  delete movieQuotesDb[quoteId];

  res.redirect('/quotes');
});

// Delete the quote

module.exports = router;
