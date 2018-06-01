const mongoose = require('mongoose');

const insuranceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: String,
  name: String,
  memberID: String,
  groupNumber: String,
  relationship: String
});

module.exports = mongoose.model('Insurance', insuranceSchema)
