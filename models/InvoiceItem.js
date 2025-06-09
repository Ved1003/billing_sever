// const mongoose = require('mongoose');
// const invoiceItemSchema = new mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//   quantity: { type: Number, required: true },
//   price: { type: Number, required: true }
// });
// module.exports = mongoose.model('InvoiceItem', invoiceItemSchema);

const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true }
});

module.exports =
  mongoose.models.InvoiceItem ||
  mongoose.model('InvoiceItem', invoiceItemSchema);
