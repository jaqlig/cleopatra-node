var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServiceSchema = new Schema(
  {
    name: {type: String, required: true, minlength: 1, maxlength: 100},
    gender: {type: String, enum : ['mężczyzna','kobieta'], required: true},
    approx_time: {type: Number, required: true},
    price: {type: Number, required: true},
    notes: {type: String}
  }
);

ServiceSchema
.virtual('url')
.get(function () {
    return '/services/' + this._id;
});

module.exports = mongoose.model('Service', ServiceSchema);
