var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema(
  {
    first_name: {type: String, required: true, minlength: 1, maxlength: 100},
    last_name: {type: String, required: true, minlength: 1, maxlength: 100},
    phone_number: {type: String, minlength: 1, maxlength: 20},
    email: {type: String, minlength: 1, maxlength: 100},
    password: {type: String, required: true},
    gender: {type: String, enum : ['male','female', 'other'], required: true},
    age: {type: String, enum : ['kid','young', 'mid', 'old'], required: true},
    hair_length: {type: String, minlength: 1, maxlength: 100},
    hair_type: {type: String, minlength: 1, maxlength: 100},
    registration_date: {type: Date, required: true},
    last_visit: {type: Date, required: true, default: null},
    loyalty_points: {type: Number, required: true, default: 0},
    notes: {type: String}
  }
);

module.exports = mongoose.model('Client', ClientsSchema);
