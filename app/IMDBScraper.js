// Require Dir Adapter class
const checker = require('./FileAdapter');
// Require depenencies
const puppeteer = require('puppeteer');
// Require Scraper
const Scraper = require('./Scraper');

module.exports = class IMDBScraper extends Scraper {
  constructor(url, domain) {
    super(url, domain);
  }
    // We'll need to analyze the data on our web page before we try this bit.
    makeIMDbJSON = async () => {
      try {
        // Use our get IMDbJson method then construct our file with the returned data
        await this.getIMDbJSON().then(cast => {
          // Count how many files are in our jsonnn file
          const currentPage = checker.countFilesInFolder('./json');
          // construct the path we'll want to write to.
          const path = `./json/${this.domain}-json-${currentPage}.json`;
          // Stringify the JSON
          const jsonStr = JSON.stringify(cast, null, 2);
          // Write the new file with our json.
          checker.createNewJsonFile(path, jsonStr);
        });
      } catch (err) {
        this.handleError(err);
      }
    };
  
    // Get cast members from IMDB and return JSON
    getIMDbJSON = async () => {
      try {
        // create browser instance
        const browser = await puppeteer.launch();
        // create a page in the browser
        const page = await browser.newPage();
        // go to a website via Scraper instance's URL
        await page.goto(this.url);
        // analyze our page
        const cast = await page.evaluate(() => {
          // Helper function gets image from castmember
          const actorImage = castmember => {
            // get all attributes in the image
            const attributeArr = castmember
              .querySelector('a')
              .innerHTML.split(' ');
            // Find the 'src' attribute
            const imageSrc = attributeArr.find(attribute =>
              attribute.includes('src')
            );
            let imageUrl = imageSrc.split('src=')[1].replace('"', '');
            // return the url
            return (imageUrl = imageUrl.replace('"', ''));
          };
          
          // Helper function gets the actor's name
          const actorName = castmember =>
            castmember.querySelector('td').nextElementSibling.querySelector('a')
              .innerText;
  
          // Helper function gets actor's role
          const actorRole = castmember =>
            castmember.querySelector('.character').innerText;
  
          // Select rows and join them all
          const castArr = [
            ...document.querySelectorAll('tr.odd'),
            ...document.querySelectorAll('tr.even')
          ];
  
          // Empty array to store data
          let castData = [];
  
          for (const castMember of castArr) {
            let [id, actor, headshot, role] = [
              castArr.indexOf(castMember),
              actorName(castMember),
              actorImage(castMember),
              actorRole(castMember)
            ];
  
            let castMemberData = {
              id,
              actor,
              headshot,
              role
            };
            castData.push(castMemberData);
          }
          // return the data
          return castData;
        });
        await browser.close();
        return cast;
      } catch (err) {
        this.handleError(err);
      }
    };
};
