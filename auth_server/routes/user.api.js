const router = require('express').Router();
const UserController = require('../controllers/UserController')
const validation = require('../validations/UserValidation');
const schemaValidator = require('../middlewares/schemaValidator');
const authMiddleware = require('../middlewares/auth');

router.get('/authentication', authMiddleware, UserController.getAuthenticatedUser)
router.get('/login', UserController.userLogin)
router.put('/register', schemaValidator(validation.createUser), UserController.createUser)

module.exports = router