// const mongoose = require('mongoose');
// const invoiceSchema = new mongoose.Schema({
//   customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
//   items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvoiceItem', required: true }],
//   total: { type: Number, required: true },
//   discount: { type: Number, default: 0 },
//   tax: { type: Number, default: 0 },
//   shippingCost: { type: Number, default: 0 },
//   status: { type: String, enum: ['Paid','Pending','Cancelled'], default: 'Pending' },
//   dueDate: { type: Date },
//   paymentMethod: { type: String },
//   notes: { type: String }
// }, { timestamps: true });
// module.exports = mongoose.model('Invoice', invoiceSchema);


// backend/models/Invoice.js

const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Customer", 
      required: true 
    },

    items: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "InvoiceItem", 
        required: true 
      }
    ],

    subtotal: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    discount: { 
      type: Number, 
      default: 0 
    },
    taxPercent: { 
      type: Number, 
      default: 0 
    },
    tax: { 
      type: Number, 
      default: 0 
    },
    shippingCost: { 
      type: Number, 
      default: 0 
    },
    total: { 
      type: Number, 
      required: true, 
      default: 0 
    },

    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue"],
      default: "draft",
    },

    dueDate: { 
      type: Date 
    },
    paymentMethod: { 
      type: String 
    },
    notes: { 
      type: String 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
