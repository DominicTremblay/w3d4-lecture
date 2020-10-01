const express = require('express');
const router = express.Router();

module.exports = ({findUserByEmail, addNewUser, authenticateUser}) => {
  // Authentication

  // Display the register form
  router.get('/register', (req, res) => {
    const templateVars = { currentUser: null };
    res.render('register', templateVars);
  });

  // Get the info from the register form
  router.post('/register', (req, res) => {
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
  router.get('/login', (req, res) => {
    const templateVars = { currentUser: null };
    res.render('login', templateVars);
  });


  // Authenticate the user
  router.post('/login', (req, res) => {
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

  router.post('/logout', (req, res) => {
    // clear the cookies
    req.session['user_id'] = null;

    // redirect to /quotes
    res.redirect('/quotes');
  });

  return router;
};
