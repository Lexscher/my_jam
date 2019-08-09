// Import our classes
const IMDBScraper = require('./app/IMDBScraper');

// set url
const otherhoodImdbUrl = 'https://www.imdb.com/title/tt4180560/';

// Create an instance of our Scraper class
const castScraper = new IMDBScraper(otherhoodImdbUrl);

castScraper.makeScreenshot();
castScraper.makePDF();
castScraper.makeIMDbJSON();
