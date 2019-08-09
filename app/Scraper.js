// Require Dir Adapter class
const checker = require('./DirAdapter');
// Require depenencies
const puppeteer = require('puppeteer');

class Scraper {
  constructor(url) {
    this.url = url;
    // Split the url.
    this.splitUrl = url.split('.');
    // Get the domain name.
    this.domain = this.splitUrl[1].includes('/')
      ? this.splitUrl[0]
      : this.splitUrl[1];
  }

  // Fetch data from the website
  makeScreenshot = async () => {
    try {
      // create browser instance
      const browser = await puppeteer.launch();
      // create a page in the browser
      const page = await browser.newPage();
      // go to a website via Scraper instance's URL
      await page.goto(this.url);
      // Count how many files are in our screenshots
      const currentPage = await checker.countFilesInFolder('./screenshots');
      // Create a new screenshot, name based on url &  the number of files in "screenshots"
      await page.screenshot({
        path: `./screenshots/${this.domain}-screenshot-${currentPage}.png`
      });
      // Close browser
      await browser.close();
      // Handle error
    } catch (err) {
      this.handleError(err);
    }
  };

  makePDF = async () => {
    try {
      // create browser instance
      const browser = await puppeteer.launch();
      // create a page in the browser
      const page = await browser.newPage();
      // go to a website via Scraper instance's URL
      await page.goto(this.url);
      // Count how many files are in our screenshots
      const currentPage = await checker.countFilesInFolder('./pdf');
      // Create a new screenshot, name based on url &  the number of files in "pdfs"
      await page.pdf({
        path: `./pdfs/${this.domain}-pdf-${currentPage}.pdf`
      });
      await browser.close();
    } catch (err) {
      this.handleError(err);
    }
  };

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

  // error handler
  handleError = error => {
    console.log("Something's not right...");
    console.error(error.stack);
  };

  showDomain = () => this.domain;
}

module.exports = Scraper;
