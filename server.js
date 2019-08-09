//  Require dependencies
const express = require('express');

// Import our IMDBScraper class
const IMDBScraper = require('./app/IMDBScraper');

//  use express
const app = express();

// set our port
const port = process.env.PORT || 3000;
app.set('port', port);

// set url
const otherhoodImdbUrl = 'https://www.imdb.com/title/tt4180560/';

// Create a new instance of our IMDBScraper class
const otherhoodCastScraper = new IMDBScraper(otherhoodImdbUrl);

// set our route to GET all the JSON
app.get('/', (req, res) => {
  // render JSON data on localhost:3000
  otherhoodCastScraper
    .getIMDbJSON()
    .then(data => res.json({ name: 'Otherhood', cast: data }))
    .catch(err => console.error(err.stack));
});

// Run our server
app.listen(port, () =>
  console.log(`Express application running on port ${port}`)
);
