var userArgs = process.argv.slice(2);

var async = require('async')
var Hairdresser = require('./models/hairdresser')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var hairdressers = []

function hairdresserCreate(first_name, last_name, notes, cb) {
  hairdresserdetail = { 
    first_name: first_name,
    last_name: last_name,
    notes: notes
  }
    
  var hairdresser = new Hairdresser(hairdresserdetail);
  hairdresser.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Hairdresser: ' + hairdresser);
    hairdressers.push(hairdresser);
    cb(null, hairdresser);
  });
}


  
function createHairdressers(cb) {
    async.parallel([
        function(callback) {
          hairdresserCreate('John', 'Doe', 'aa',   callback)
        },
        function(callback) {
          hairdresserCreate('Jack', '1234', 'Aa', callback)
        },
        function(callback) {
          hairdresserCreate('uighioua', 'sdfsdfsdf', 'Aa', callback)
        }
        ],
        cb);
}

async.series([
    createHairdressers
],
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    mongoose.connection.close();
});
