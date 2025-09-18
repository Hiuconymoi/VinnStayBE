const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const validate = require('../middleware/validate');

router.post('/register', validate(registerSchema), authCtrl.register);
router.post('/login', validate(loginSchema), authCtrl.login);

module.exports = router;
