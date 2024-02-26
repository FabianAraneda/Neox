"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const validar_campos_1 = require("../middlewares/validar-campos");
const db_validators_1 = require("../helpers/db-validators");
const router = (0, express_1.Router)();
router.post('/login', [
    (0, express_validator_1.check)('email', 'El correo es obligatorio').isEmail(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').not().isEmpty(),
    (0, express_validator_1.check)('email').custom(db_validators_1.existeEmailLogin),
    (0, express_validator_1.check)('email').custom(db_validators_1.estaBloqueado),
    validar_campos_1.validaCampos,
], auth_controller_1.login);
exports.default = router;
//# sourceMappingURL=auth.route.js.map