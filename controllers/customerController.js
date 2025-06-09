// const Customer = require('../models/Customer');
// const { validationResult } = require('express-validator');

// exports.getAll = async (req, res, next) => {
//   try { res.json(await Customer.find()); }
//   catch(err){ next(err); }
// };
// exports.getById = async (req, res, next) => {
//   try { res.json(await Customer.findById(req.params.id)); }
//   catch(err){ next(err); }
// };
// exports.create = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
//   try { res.status(201).json(await Customer.create(req.body)); }
//   catch(err){ next(err); }
// };
// exports.update = async (req, res, next) => {
//   try { res.json(await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
//   catch(err){ next(err); }
// };
// exports.delete = async (req, res, next) => {
//   try { res.json(await Customer.findByIdAndDelete(req.params.id)); }
//   catch(err){ next(err); }
// };


// billing-backend/controllers/customerController.js

const Customer = require('../models/Customer');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.getAll = async (req, res, next) => {
  try {
    const all = await Customer.find();
    res.json(all);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid customer ID' });
  }
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json(newCustomer);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid customer ID' });
  }
  try {
    const updated = await Customer.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid customer ID' });
  }
  try {
    const deleted = await Customer.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    next(err);
  }
};
