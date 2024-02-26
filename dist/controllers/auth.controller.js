"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generar_jwt_1 = require("../helpers/generar-jwt");
const dbConnection_1 = require("../database/dbConnection");
const mssql_1 = __importDefault(require("mssql"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool
            .request()
            .input('email', mssql_1.default.VarChar(150), email)
            .query("SELECT id, email, password, firstName + ' ' + fatherLastname AS name FROM [USER] WHERE email = @email");
        const usuario = {
            id: result.recordset[0].id,
            email: result.recordset[0].email,
            password: result.recordset[0].password,
            name: result.recordset[0].name
        };
        //Verificar contraseña
        const validPassword = bcryptjs_1.default.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                message: 'Usuario / Contraseña incorrectos'
            });
        }
        // Generar Token
        const token = yield (0, generar_jwt_1.generarJWT)(usuario.id, usuario.name, usuario.email);
        res.json({
            msg: 'OK',
            usuario,
            token
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Algo sali+o mal ${error}`
        });
    }
});
exports.login = login;
//# sourceMappingURL=auth.controller.js.map