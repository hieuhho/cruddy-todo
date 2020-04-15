const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

//MINIMUM REQUIREMENTS FUNCTIONS

// const readCounter = (callback) => {
//   fs.readFile(exports.counterFile, (err, fileData) => {
//     if (err) {
//       callback(null, 0);
//     } else {
//       callback(null, Number(fileData));
//     }
//   });
// };

// const writeCounter = (count, callback) => {
//   var counterString = zeroPaddedNumber(count);
//   fs.writeFile(exports.counterFile, counterString, (err) => {
//     if (err) {
//       throw ('error writing counter');
//     } else {
  //       callback(null, counterString);
  //     }
  //   });
  // };

  // exports.getNextUniqueId = (callback) => {
  //   readCounter((error, currentCount) => {
  //     writeCounter(currentCount + 1, (error, counterString) => {
  //       callback(error, counterString);
  //     });
  //   });
  // };


const readCounter = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(exports.counterFile, (err, fileData) => {
      if (err) { reject (err); }
      else {
        resolve(Number(fileData));
      }
    });
  });
};

const writeCounter = (count) => {
  return new Promise((resolve, reject) => {
    let counterString = zeroPaddedNumber(count);
    fs.writeFile(exports.counterFile, counterString, (err) => {
      if (err) { reject(err); }
      else {
        resolve(counterString);
      }
    });
  });
};

// Public API - Fix this function //////////////////////////////////////////////


//Async functions may not play nice with scoped variables

exports.getNextUniqueId = (cb) => {
  return readCounter()
  .then((count) => (count += 1))
  .then((newCount) => writeCounter(newCount))
  .then((result) => cb(null,result))
  .catch((err) => cb(err,null))
};


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
