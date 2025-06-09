const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  company: { type: String },           // ← newly added field

}, { timestamps: true });
module.exports = mongoose.model('Customer', customerSchema);