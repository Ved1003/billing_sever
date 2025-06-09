// const router = require('express').Router();
// const { protect, authorize } = require('../middlewares/auth');
// const { check } = require('express-validator');
// const ctrl = require('../controllers/customerController');

// router.use(protect);
// router.route('/')
//   .get(ctrl.getAll)
//   .post(
//     authorize('Admin','Staff'),
//     [ check('name','Name required').notEmpty(), check('email','Valid email').isEmail() ],
//     ctrl.create
//   );
// router.route('/:id')
//   .get(ctrl.getById)
//   .put(authorize('Admin','Staff'), ctrl.update)
//   .delete(authorize('Admin'), ctrl.delete);

// module.exports = router;

// billing-backend/routes/customers.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const customerController = require('../controllers/customerController');

// GET /api/customers
router.get('/', customerController.getAll);

// GET /api/customers/:id
router.get('/:id', customerController.getById);

// POST /api/customers
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    // phone, address, company are optional
  ],
  customerController.create
);

// PUT /api/customers/:id
router.put(
  '/:id',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
  ],
  customerController.update
);

// DELETE /api/customers/:id
router.delete('/:id', customerController.delete);

module.exports = router;
