//  Require dependencies
const express = require('express');

// Import our Scraper class
const Scraper = require('./app/Scraper');


//  use express
const app = express();

// set our port
const port = process.env.PORT || 3000;
app.set('port', port);

// set urls
const otherhoodImdbUrl = 'https://www.imdb.com/title/tt4180560/'

// Create an instance of our Scraper class
const castScraper = new Scraper(otherhoodImdbUrl);

// routes
app.get('/', (req, res) => {
  // show JSON
  castScraper
    .getIMDbJSON()
    .then(data => {
      res.json({ name: 'Otherhood', cast: data });
    })
    .catch(err => console.error(err.stack));
});

// Run our server
app.listen(port, () =>
  console.log(`Express application running on port ${port}`)
);


