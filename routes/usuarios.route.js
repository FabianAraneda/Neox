const { Router } = require('express');
const { getUsuarios, putUsuarios, deleteUsuarios, postUsuarios } = require('../controllers/usuarios.controller');

const router = Router();

router.get('/', getUsuarios);

router.put('/:id', putUsuarios);

router.post('/', postUsuarios);

router.delete('/', deleteUsuarios);








module.exports = router;