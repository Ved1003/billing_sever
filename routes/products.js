// const router = require('express').Router();
// const { protect, authorize } = require('../middlewares/auth');
// const { check } = require('express-validator');
// const ctrl = require('../controllers/productController');

// router.use(protect);
// router.route('/')
//   .get(ctrl.getAll)
//   .post(
//     authorize('Admin','Staff'),
//     [
//       check('name','Name required').notEmpty(),
//       check('price','Price number').isNumeric(),
//       check('category','Category ID').notEmpty()
//     ],
//     ctrl.create
//   );
// router.route('/:id')
//   .get(ctrl.getById)
//   .put(authorize('Admin','Staff'), ctrl.update)
//   .delete(authorize('Admin'), ctrl.delete);

// module.exports = router;


// billing-backend/routes/products.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Valid price is required'),
    // etc.
  ],
  productController.create
);

router.put(
  '/:id',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('price').optional().isNumeric().withMessage('Valid price is required'),
  ],
  productController.update
);

router.delete('/:id', productController.delete);

module.exports = router;
