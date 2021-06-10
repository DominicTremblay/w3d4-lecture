const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const createNewQuote = (content, movieQuotesDb) => {
  const quoteId = uuid().substr(0, 8);

  // creating the new quote object
  const newQuote = {
    id: quoteId,
    quote: content,
  };

  // Add the newQuote object to movieQuotesDb

  movieQuotesDb[quoteId] = newQuote;

  return quoteId;

};

const updateQuote = (quoteId, content, movieQuotesDb) => {
  // updating the quote key in the quote object
  movieQuotesDb[quoteId].quote = content;

  return true;
};

const addNewUser = (name, email, textPassword, usersDb) => {
  // Generate a random id
  const userId = uuid().substr(0, 8);
  const password = bcrypt.hashSync(textPassword, saltRounds)

  const newUserObj = {
    id: userId,
    name,
    email,
    password,
  };

  // Add the user Object into the usersDb

  usersDb[userId] = newUserObj;

  // return the id of the user

  return userId;
};

const findUserByEmail = (email, usersDb) => {
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


module.exports = {createNewQuote, updateQuote, authenticateUser, findUserByEmail, addNewUser};