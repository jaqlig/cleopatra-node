var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema(
  {
    first_name: {type: String, required: true, minlength: 1, maxlength: 100},
    last_name: {type: String, required: true, minlength: 1, maxlength: 100},
    phone_number: {type: String, minlength: 1, maxlength: 20},
    email: {type: String, minlength: 1, maxlength: 100},
    gender: {type: String, enum : ['mężczyzna','kobieta', 'inna']},
    hair_length: {type: String, minlength: 1, maxlength: 100},
    hair_type: {type: String, minlength: 1, maxlength: 100},
    registration_date: {type: String},
    loyalty_points: {type: Number, default: 0},
    notes: {type: String}
  }
);

ClientSchema
.virtual('url')
.get(function () {
    return '/clients/' + this._id;
});

module.exports = mongoose.model('Client', ClientSchema);
