var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HairdresserSchema = new Schema(
  {
    first_name: {type: String, required: true, minlength: 1, maxlength: 100},
    last_name: {type: String, required: true, minlength: 1, maxlength: 100},
    birth: {type: String},
    phone_number: {type: String, minlength: 1, maxlength: 20},
    email: {type: String, minlength: 1, maxlength: 100},
    password: {type: String, required: true},
    employment_date: {type: String},
    notes: {type: String}
  }
);

HairdresserSchema
.virtual('url')
.get(function () {
    return '/hairdressers/' + this._id;
});

module.exports = mongoose.model('Hairdresser', HairdresserSchema);
