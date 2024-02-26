"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validarJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    try {
        if (!token) {
            return res.status(401).json({
                code: 401,
                message: 'No hay token en la petición',
            });
        }
        jsonwebtoken_1.default.verify(token, process.env.SECRETORPUBLICKEY); // Asigna el tipo string a process.env.SECRETORPUBLICKEY
        next();
    }
    catch (error) {
        res.status(401).json({
            code: 401,
            message: 'Token inválido',
        });
    }
};
exports.validarJWT = validarJWT;
//# sourceMappingURL=validar-jwt.js.map