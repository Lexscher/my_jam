// Require path and fs modules
const fs = require('fs');

module.exports = class FileAdapter {
  /* Check all the files in a Folder */
  static countFilesInFolder = folderPath => {
    // initiate a file count
    let fileCount = 0
    // use fs reader
    fs.readdir(folderPath, (error, files) => {
      // error handling
      if (error) return console.error(error.stack);
      // set fileCount to the number of files in the folder
      fileCount = files.length;
    });
    // return the file count
    return fileCount;
  };
  
  /* Create a new file within a folder */
  static createNewJsonFile = (newFilePath, jsonObject) => {
    fs.writeFile(newFilePath, jsonObject, error => {
      error
        ? console.error('Could not write file!', error)
        : console.log(`Data written in new file! Look for ${newFilePath}`);
    });
  };
};
