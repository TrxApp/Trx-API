const mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: String,
  pharmacy: String,
  image: String,
  date: String,
  status: String
});

module.exports = mongoose.model('Prescriptions', prescriptionSchema)
