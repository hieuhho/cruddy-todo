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
/*
return an array of todos
read dataDir to build file list
*/


//Promise.all

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw (`READ FILE ERROR: No item with id: ${id}`);
    } else {
      let promiseRead = _.map(files, (file) => {
        let id = file.replace(".txt", "");
        return asyncReadOne(id);
      });
      Promise.all(promiseRead)
      .then((result) => {
        callback(null, result);
      });
    }
  });
};

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

// refactor later

// exports.update = (id, text, callback) => {
//   exports.readOne(id, (err, data) => {
//     fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
//       if (err) {
//         throw ('WRITE FILE ERROR', err);

//         // callback(new Error(`No item with id: ${id}`));
//       } else {
//         callback(null, {id, text});
//       }
//     })
//   });
// }

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
