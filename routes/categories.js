const router = require('express').Router();
const { protect, authorize } = require('../middlewares/auth');
const { check } = require('express-validator');
const ctrl = require('../controllers/categoryController');

router.use(protect);
router.route('/')
  .get(ctrl.getAll)
  .post(
    authorize('Admin','Staff'),
    [ check('name','Name required').notEmpty() ],
    ctrl.create
  );
router.route('/:id')
  .get(ctrl.getById)
  .put(authorize('Admin','Staff'), ctrl.update)
  .delete(authorize('Admin'), ctrl.delete);

module.exports = router;