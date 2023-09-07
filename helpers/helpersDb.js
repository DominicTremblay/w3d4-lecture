
const uuid = require('uuid/v4');


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

const updateQuote = (quoteId, content) => {
  // updating the quote key in the quote object
  movieQuotesDb[quoteId].quote = content;

  return true;
};

module.exports = {
  createNewQuote,
  updateQuote
}