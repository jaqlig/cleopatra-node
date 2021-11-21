var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServiceSchema = new Schema(
  {
    name: {type: String, required: true, minlength: 1, maxlength: 100},
    gender: {type: String, enum : ['male','female'], required: true},
    approx_time: {type: Number, required: true},
    price: {type: Number, required: true},
  }
);

module.exports = mongoose.model('Service', ServiceSchema);
