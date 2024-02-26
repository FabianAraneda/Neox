"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const usuarios_controller_1 = require("../controllers/usuarios.controller");
const db_validators_1 = require("../helpers/db-validators");
const validar_campos_1 = require("../middlewares/validar-campos");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const router = (0, express_1.Router)();
router.get('/:id', [validar_jwt_1.validarJWT], usuarios_controller_1.getUser);
router.get('/', [validar_jwt_1.validarJWT], usuarios_controller_1.getUsers);
router.get('/getSecretCode/:email', [
    (0, express_validator_1.check)('email', 'El correo es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email').custom(db_validators_1.existeEmailLogin)
], usuarios_controller_1.getSecretCode);
router.post('/', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('firstName', 'El primer nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('fatherLastname', 'El apellido paterno es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('motherLastname', 'El apellido materno es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El correo es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El password debe tener 6 o más caracteres').isLength({
        min: 6
    }),
    (0, express_validator_1.check)('email').custom(db_validators_1.existeEmail),
    validar_campos_1.validaCampos
], usuarios_controller_1.postUser);
router.put('/:id', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('id', 'No es un id valido').isInt(),
    (0, express_validator_1.check)('id').custom(db_validators_1.existeUsuario),
    validar_campos_1.validaCampos
], usuarios_controller_1.putUser);
router.put('/changePassword/:id', [
    (0, express_validator_1.check)('id', 'No es un id valido').isInt(),
    (0, express_validator_1.check)('id').custom(db_validators_1.existeUsuario),
    (0, express_validator_1.check)('email', 'El correo es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email').custom(db_validators_1.existeEmailLogin),
    (0, express_validator_1.check)('code').custom(db_validators_1.existeCodigo),
    (0, express_validator_1.check)('code', 'El codigo secreto es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El password debe tener 6 o más caracteres').isLength({ min: 6 }),
    validar_campos_1.validaCampos
], usuarios_controller_1.changePassword);
router.delete('/:id', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('id', 'No es un id valido').isInt(),
    (0, express_validator_1.check)('id').custom(db_validators_1.existeUsuario),
    validar_campos_1.validaCampos
], usuarios_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=usuarios.route.js.map