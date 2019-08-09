// Require Dir Adapter class
const checker = require('./FileAdapter');
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

  // make screenshot of web page
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

  // make pdf out of web page
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

  // error handler
  handleError = error => {
    console.log("Something's not right...");
    console.error(error.stack);
  };
  
  // show the domain
  showDomain = () => this.domain;
}

module.exports = Scraper;
