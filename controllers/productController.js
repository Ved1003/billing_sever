// const Product = require('../models/Product');
// const { validationResult } = require('express-validator');

// exports.getAll = async (req, res, next) => {
//   try { res.json(await Product.find().populate('category')); }
//   catch(err){ next(err); }
// };
// exports.getById = async (req, res, next) => {
//   try { res.json(await Product.findById(req.params.id).populate('category')); }
//   catch(err){ next(err); }
// };
// exports.create = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
//   try { res.status(201).json(await Product.create(req.body)); }
//   catch(err){ next(err); }
// };
// exports.update = async (req, res, next) => {
//   try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
//   catch(err){ next(err); }
// };
// exports.delete = async (req, res, next) => {
//   try { res.json(await Product.findByIdAndDelete(req.params.id)); }
//   catch(err){ next(err); }
// };

// billing-backend/controllers/productController.js

const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.getAll = async (req, res, next) => {
  try {
    const all = await Product.find().populate('category');
    res.json(all);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  try {
    const product = await Product.findById(id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  // Ensure category is provided as an ObjectId
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  try {
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
