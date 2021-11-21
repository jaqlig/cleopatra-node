var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitSchema = new Schema(
  {
    when: {type: Date, required: true},
    service: [{type: Schema.Types.ObjectId, ref: 'Service'}],
    client: [{type: Schema.Types.ObjectId, ref: 'Client'}],
    notes: {type: String}
  }
);

module.exports = mongoose.model('Visit', VisitSchema);
