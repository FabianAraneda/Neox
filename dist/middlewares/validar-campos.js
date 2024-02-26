"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validaCampos = void 0;
const express_validator_1 = require("express-validator");
const validaCampos = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    // Continuar con el siguiente middleware o controlador
    next();
};
exports.validaCampos = validaCampos;
//# sourceMappingURL=validar-campos.js.map