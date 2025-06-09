// const router = require('express').Router();
// const { protect, authorize } = require('../middlewares/auth');
// const { check } = require('express-validator');
// const ctrl = require('../controllers/invoiceController');

// const invoiceValidation = [
//   check('customer','Customer ID').notEmpty(),
//   check('items','Items array').isArray({ min:1 }),
//   check('total','Total number').isNumeric(),
// ];

// router.use(protect);
// router.route('/')
//   .get(ctrl.getAll)
//   .post(
//     authorize('Admin','Staff'),
//     invoiceValidation,
//     ctrl.create
//   );
// router.route('/:id')
//   .get(ctrl.getById);

// module.exports = router;

const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const { body } = require("express-validator");

// POST /api/invoices
router.post(
  "/",
  [
    body("customer").notEmpty().withMessage("Customer is required"),
    body("items").isArray({ min: 1 }).withMessage("At least one item"),
    // … you can add more validators …
  ],
  invoiceController.create
);

// GET /api/invoices
router.get("/", invoiceController.getAll);

// GET /api/invoices/:id
router.get("/:id", invoiceController.getById);

// PUT /api/invoices/:id
router.put(
  "/:id",
  [
    body("customer").notEmpty().withMessage("Customer is required"),
    body("items").isArray({ min: 1 }).withMessage("At least one item"),
    // … more validators as desired …
  ],
  invoiceController.update
);

// DELETE /api/invoices/:id
router.delete("/:id", invoiceController.delete);

module.exports = router;
