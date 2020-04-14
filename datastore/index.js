const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id)=>{
    if (err) {
      throw ('GET ID ERROR');
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          throw ('WRITE FILE ERROR');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};
/*
return an array of todos
read dataDir to build file list
*/


exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    let result = [];
    if (err) {
      throw ('READ ALL ERROR');
    } else {
      _.map(files, (file) => {
        let id = file.replace('.txt', '');
        result.push({id: id, text: id});
      });
    } callback(null, result);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id: id, text: data});
    }
  });
};

//refactor later
// exports.update = (id, text, callback) => {
//   exports.readOne(id, (err, data) => {
//     fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
//       if (err) {
//         callback(new Error(`No item with id: ${id}`));
//       } else {
//         callback(null, {id, text});
//       }
//     })
//   });
// }

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, {id, text});
        }
      })
    }
  });
};


exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
