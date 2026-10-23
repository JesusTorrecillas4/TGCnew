const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateObjectId = require('../middleware/validateObjectId');

// ATENCIÓN: sin JWT ni RBAC (sesiones siguientes) estas rutas son SOLO para uso local con datos ficticios.
router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', validateObjectId(), userController.getUserById);
router.put('/:id', validateObjectId(), userController.updateUser);
router.delete('/:id', validateObjectId(), userController.deactivateUser);

module.exports = router;