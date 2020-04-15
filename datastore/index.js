const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id)=>{
    if (err) {
      throw (`GET FILE ERROR: No item with id: ${id}`);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          throw (`WRITE FILE ERROR: No item with id: ${id}`);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

// exports.create = (text) => {
//   return new Promise((resolve, reject) => {

//   counter.getNextUniqueId((err, id) => {
//     if (err) { reject(err); }
//     else {
//       fs.writeFileSync(path.join(exports.dataDir, `${id}.txt`), text);
//       resolve( {id: id, text: text} );
//     };
//   });
// });
// }



exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {
    if (err) {
      callback (`READ FILE ERROR: No item with id: ${id}`);
    } else {
      callback(null, {id: id, text: data});
    }
  });
};

var asyncReadOne = Promise.promisify(exports.readOne);

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    let promiseRead = _.map(files, (file) => {
      let id = file.replace('.txt', '');
      return asyncReadOne(id);
    });
    Promise.all(promiseRead)
      .then((result) => {
        callback(null, result);
      });
  });
};


exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {
    if (err) {
      callback (`READ FILE ERROR: No item with id: ${id}`);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback (`WRITE FILE ERROR: No item with id: ${id}`);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};


exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback (`READ FILE ERROR: No item with id: ${id}`);
    } else {
      callback();
    }
  });
};


// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
