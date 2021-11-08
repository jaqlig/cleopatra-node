var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HairdresserSchema = new Schema(
  {
    first_name: {type: String, required: true, minlength: 1, maxlength: 100},
    last_name: {type: String, required: true, minlength: 1, maxlength: 100},
    birth: {type: Date},
    notes: {type: String}
  }
);

HairdresserSchema
.virtual('url')
.get(function () {
    return '/hairdresser/' + this._id;
});

module.exports = mongoose.model('Hairdresser', HairdresserSchema);
