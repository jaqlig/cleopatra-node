var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitSchema = new Schema(
  {
    when: {type: Date, required: true},
    service: [{type: Schema.Types.ObjectId, ref: 'Service'}],
    hairdresser: [{type: Schema.Types.ObjectId, ref: 'Hairdresser'}],
    client: [{type: Schema.Types.ObjectId, ref: 'Client'}],
    notes: {type: String}
  }
);

VisitSchema
.virtual('url')
.get(function () {
    return '/visits/' + this._id;
});

module.exports = mongoose.model('Visit', VisitSchema);
