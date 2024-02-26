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
exports.existeCodigo = exports.existeUsuario = exports.existeEmail = exports.estaBloqueado = exports.existeEmailLogin = void 0;
const dbConnection_1 = require("../database/dbConnection");
const mssql_1 = __importDefault(require("mssql"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const existeEmailLogin = (correo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool.request()
            .input('email', mssql_1.default.VarChar(150), correo)
            .query('SELECT COUNT(1) AS count FROM [USER] WHERE email = @email;');
        if (result.recordset[0].count < 1) {
            throw new Error(`El correo ${correo} NO se encuentra registrado`);
        }
    }
    catch (error) {
        throw new Error(`Error de verificación de correo: ${error.message}`);
    }
});
exports.existeEmailLogin = existeEmailLogin;
const estaBloqueado = (correo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool.request()
            .input('email', mssql_1.default.VarChar(150), correo)
            .query('SELECT status FROM [USER] WHERE email = @email;');
        if (result.recordset[0].status === 0) {
            throw new Error(`El usuario ${correo} se encuentra bloqueado`);
        }
    }
    catch (error) {
        throw new Error(`Error de verificación de correo: ${error.message}`);
    }
});
exports.estaBloqueado = estaBloqueado;
const existeEmail = (correo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool.request()
            .input('email', mssql_1.default.VarChar(150), correo)
            .query('SELECT COUNT(1) AS count FROM [USER] WHERE email = @email;');
        if (result.recordset[0].count > 0) {
            throw new Error(`El correo ${correo} ya se encuentra registrado en la BD`);
        }
    }
    catch (error) {
        throw new Error(`Error de verificación de correo: ${error.message}`);
    }
});
exports.existeEmail = existeEmail;
const existeUsuario = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool.request()
            .input('id', mssql_1.default.Int, id)
            .query('SELECT COUNT(1) AS count FROM [USER] WHERE id = @id;');
        if (result.recordset[0].count < 1) {
            throw new Error(`El usario con id ${id} NO existe`);
        }
    }
    catch (error) {
        throw new Error(`Error de verificación de usuario: ${error.message}`);
    }
});
exports.existeUsuario = existeUsuario;
const existeCodigo = (code, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool.request()
            .input('user_id', mssql_1.default.Int, Number.parseInt(id))
            .query('SELECT * FROM [SECRET_CODE] ' +
            'WHERE user_id = @user_id ' +
            'AND code_status = 1');
        if (!result.recordset[0]) {
            throw new Error(`El código secreto no existe para el usuario ${id}`);
        }
        const validCode = bcryptjs_1.default.compareSync(code, result.recordset[0].code);
        if (!validCode) {
            throw new Error(`El código secreto no existe para el usuario ${id}`);
        }
    }
    catch (error) {
        throw new Error(`Error de verificación de correo: ${error.message}`);
    }
});
exports.existeCodigo = existeCodigo;
//# sourceMappingURL=db-validators.js.map