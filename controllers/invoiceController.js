// backend/controllers/invoiceController.js

const Invoice = require("../models/Invoice");
const InvoiceItem = require("../models/InvoiceItem");
const { validationResult } = require("express-validator");

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      invoiceNumber,
      customer,
      items: rawItems,
      subtotal,
      discount = 0,
      taxPercent = 5,
      tax,
      shippingCost = 0,
      total,
      status = "draft",
      dueDate,
      paymentMethod = "",
      notes = "",
    } = req.body;

    // 1) Sanitize each nested item → { product, quantity, price, total }
    const sanitizedItems = (rawItems || []).map((i) => ({
      product: i.productId,
      quantity: i.quantity,
      price: i.price,
      total: i.total,
    }));

    // 2) Insert nested InvoiceItem docs
    const itemDocs = await InvoiceItem.insertMany(sanitizedItems);

    // 3) Build the Invoice payload
    const invoicePayload = {
      invoiceNumber,                   // ⬅️ now included
      customer,
      items: itemDocs.map((d) => d._id),
      subtotal,
      discount,
      taxPercent,
      tax,
      shippingCost,
      total,
      status,
      dueDate,
      paymentMethod,
      notes,
    };

    // 4) Create and then populate for return
    const invoice = await Invoice.create(invoicePayload);
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate("customer")
      .populate({ path: "items", populate: { path: "product" } });

    return res.status(201).json(populatedInvoice);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const invs = await Invoice.find()
      .populate("customer")
      .populate({ path: "items", populate: { path: "product" } });
    res.json(invs);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // “items” is an array of ObjectId → InvoiceItem. We want to populate each InvoiceItem’s “product” field,
    // and also populate “customer” if you need customer name/phone later on.
    const invoice = await Invoice.findById(id)
      .populate({
        path: "items",
        populate: { path: "product", select: "name price" }
      })
      .populate("customer", "name phone"); // if you need customer data in the list later

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    return res.json(invoice);
  } catch (err) {
    next(err);
  }
};
exports.update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const existing = await Invoice.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // 1) Delete old InvoiceItem docs
    await InvoiceItem.deleteMany({ _id: { $in: existing.items } });

    // 2) Remap incoming items → { product, quantity, price, total }
    const {
      invoiceNumber,
      customer,
      items: rawItems,
      subtotal,
      discount = 0,
      taxPercent = 5,
      tax,
      shippingCost = 0,
      total,
      status = "draft",
      dueDate,
      paymentMethod = "",
      notes = "",
    } = req.body;

    const sanitizedItems = (rawItems || []).map((i) => ({
      product: i.productId,
      quantity: i.quantity,
      price: i.price,
      total: i.total,
    }));

    // 3) Insert new nested items
    const newItemDocs = await InvoiceItem.insertMany(sanitizedItems);
    const newItemIds = newItemDocs.map((d) => d._id);

    // 4) Build update payload, including invoiceNumber
    const updatePayload = {
      invoiceNumber,                 // ⬅️ make sure to update this too
      customer,
      items: newItemIds,
      subtotal,
      discount,
      taxPercent,
      tax,
      shippingCost,
      total,
      status,
      dueDate,
      paymentMethod,
      notes,
    };

    const updated = await Invoice.findByIdAndUpdate(id, updatePayload, {
      new: true,
    })
      .populate("customer")
      .populate({ path: "items", populate: { path: "product" } });

    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // 1) Delete nested items
    await InvoiceItem.deleteMany({ _id: { $in: invoice.items } });

    // 2) Delete the invoice
    await Invoice.findByIdAndDelete(id);

    res.json({ message: "Invoice and its items deleted" });
  } catch (err) {
    next(err);
  }
};
