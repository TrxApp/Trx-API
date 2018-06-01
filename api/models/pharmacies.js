const mongoose = require('mongoose');

const pharmacySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  phone: Number,
  address: String,
  province: String,
  postalCode: String,
  password: String
});

module.exports = mongoose.model('Pharmacies', pharmacySchema)
