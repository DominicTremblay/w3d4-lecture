const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const salt = bcrypt.genSaltSync(10);
const movieQuotesDb = require('./db/moviesDb');
const quotesRouter = require('./routes/quotesRouter');


const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

app.use(cookieParser());

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// middleware for cookie session
app.use(
  cookieSession({
    name: 'session',
    keys: [
      'bed2393f-0a58-4ebe-8d1c-c1543a58bb99',
      'cdc9e3c3-2914-4d79-ac46-af2c3c1e17d9',
    ],
  })
);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// enable the quote router
app.use('/quotes', quotesRouter);

// Static assets (images, css files) are being served from the public folder
app.use(express.static('public'));

// Setting ejs as the template engine
app.set('view engine', 'ejs');

// Middleware function to retrive the logged in user

const getCurrentUser = (req, res, next) => {
  // get the user id from cookies
  const userId = req.session['user_id'];

  // get the user from db
  const user = usersDb[userId];

  // attache the user to the req
  req.user = user;

  // pass on to the next middleware
  next();
};

app.use(getCurrentUser);

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
    password: bcrypt.hashSync('cookinglessons', salt),
  },
  2: {
    id: 2,
    name: 'Phil A. Mignon',
    email: 'good.philamignon@steak.com',
    password: bcrypt.hashSync('meatlover', salt),
  },
};

const addNewUser = (name, email, password) => {
  // Generate a random id
  const userId = uuid().substr(0, 8);

  const newUserObj = {
    id: userId,
    name,
    email,
    password: bcrypt.hashSync(password, salt),
  };

  // Add the user Object into the usersDb

  usersDb[userId] = newUserObj;

  // return the id of the user

  return userId;
};

const findUserByEmail = (email) => {
  // loop through the usersDb object
  for (let userId in usersDb) {
    // compare the emails, if they match return the user obj
    if (usersDb[userId].email === email) {
      return usersDb[userId];
    }
  }

  // after the loop, return false
  return false;
};

const authenticateUser = (email, password) => {
  // retrieve the user with that email
  const user = findUserByEmail(email);

  // if we got a user back and the passwords match then return the userObj
  if (user && bcrypt.compareSync(password, user.password)) {
    // user is authenticated
    return user;
  } else {
    // Otherwise return false
    return false;
  }
};

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
  res.clearCookie('user_id');

  // redirect to /quotes
  res.redirect('/quotes');
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
