const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const { movieQuotesDb, quoteComments, usersDb } = require('./db');
const dbHelpers = require('./helpers/dbHelpers')(movieQuotesDb, quoteComments,usersDb);

console.log(dbHelpers);
const usersRoutes = require('./routes/users_routes');
const quotesRoutes = require('./routes/quotes_routes');

const PORT = process.env.PORT || 3005;

// creating an Express app
const app = express();

app.use(
  cookieSession({
    name: 'session',
    keys: [
      'a2b14a14-3058-4fd6-a5a3-af1a35811c95',
      'ab119d51-2c95-4292-8e0e-e7c3533fb6de',
    ],
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

// activate the users route
app.use(usersRoutes(dbHelpers));
app.use('/quotes', quotesRoutes(dbHelpers));


// this end point is for checking the content of usersDb
  // remove when cleaning up the code
  app.get('/users', (req, res) => {
    res.json(usersDb);
  });
// CRUD operations


// Delete the quote

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
