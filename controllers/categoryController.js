const Category = require('../models/Category');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res, next) => {
  try { res.json(await Category.find()); }
  catch(err){ next(err); }
};
exports.getById = async (req, res, next) => {
  try { res.json(await Category.findById(req.params.id)); }
  catch(err){ next(err); }
};
exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try { res.status(201).json(await Category.create(req.body)); }
  catch(err){ next(err); }
};
exports.update = async (req, res, next) => {
  try { res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch(err){ next(err); }
};
exports.delete = async (req, res, next) => {
  try { res.json(await Category.findByIdAndDelete(req.params.id)); }
  catch(err){ next(err); }
};