const express = require('express');
const router = express.Router();

// CRUD operations

// List all the quotes
// READ
// GET /quotes

module.exports = ({
  createNewQuote,
  updateQuote,
  authenticateUser,
  findUserByEmail,
  addNewUser,
  getQuoteList,
  getMovieQuote,
  deleteMovieQuote
}) => {
  router.get('/', (req, res) => {
    // const quoteList = Object.values(movieQuotesDb);
    const quoteList = getQuoteList();

    // get the current user
    // read the user id value from the cookies

    const userId = req.session['user_id'];
    // userId = '2'

    const loggedInUser = req.currentUser;
    // usersDb['2'] => {
    //   id: '2',
    //   name: 'Phil A. Mignon',
    //   email: 'good.philamignon@steak.com',
    //   password: 'meatlover',
    // }

    // in every template vars (except login and register), you have to provide a user key in the template vars
    const templateVars = { quotesArr: quoteList, currentUser: loggedInUser };

    res.render('quotes', templateVars);
  });

  // Display the add quote form
  // READ
  // GET /quotes/new

  router.get('/new', (req, res) => {
    // get the current user
    // read the user id value from the cookies

    const userId = req.session['user_id'];

    const loggedInUser = req.currentUser;

    const templateVars = { currentUser: loggedInUser };

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

    createNewQuote(quoteStr);

    // redirect to '/quotes'
    res.redirect('/quotes');
  });

  // Edit a quote

  // Display the form
  // GET /quotes/:id
  router.get('/:id', (req, res) => {
    const quoteId = req.params.id;
    // get the current user
    // read the user id value from the cookies

    const userId = req.session['user_id'];

    const loggedInUser = req.currentUser;
    const templateVars = {
      quoteObj: getMovieQuote(quoteId),
      currentUser: loggedInUser,
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

    delete deleteMovieQuote(quoteId);

    res.redirect('/quotes');
  });

  return router;
};
