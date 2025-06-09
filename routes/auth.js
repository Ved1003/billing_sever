const router = require('express').Router();
const { check } = require('express-validator');
const { signup, login } = require('../controllers/authController');

router.post('/signup', [
  check('name','Name required').notEmpty(),
  check('email','Valid email').isEmail(),
  check('password','Min 6 chars').isLength({ min:6 })
], signup);
router.post('/login', [
  check('email','Valid email').isEmail(),
  check('password','Password required').notEmpty()
], login);
module.exports = router;