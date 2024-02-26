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
exports.getSecretCode = exports.changePassword = exports.deleteUser = exports.putUser = exports.postUser = exports.getUsers = exports.getUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dbConnection_1 = require("../database/dbConnection");
const mssql_1 = __importDefault(require("mssql"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool.request().query('SELECT * FROM [USER]');
        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No se encontraron usuarios'
            });
        }
        return res.json({
            code: 200,
            total: result.recordset.length,
            usuarios: result.recordset
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool.request()
            .input('email', mssql_1.default.VarChar(50), req.params.id)
            .query('SELECT * FROM [USER] WHERE email = @email');
        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({
                code: 404,
                message: "No se ha encontrado el usuario"
            });
        }
        return res.json({
            code: 200,
            usuarios: result.recordset
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
});
exports.getUser = getUser;
const getSecretCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool
            .request()
            .input('email', mssql_1.default.VarChar(150), email)
            .query('SELECT * FROM [USER] WHERE email = @email');
        const usuario = {
            id: result.recordset[0].id,
            firstName: result.recordset[0].firstName,
            secondName: result.recordset[0].secondName,
            fatherLastname: result.recordset[0].fatherLastname,
            motherLastname: result.recordset[0].motherLastname,
            email: result.recordset[0].email,
            password: result.recordset[0].password
        };
        const secretCode = generateRandomCode();
        console.log('CODIGO SECRETO: ', secretCode);
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedCode = bcryptjs_1.default.hashSync(secretCode, salt);
        console.log('CODIGO SECRETO ENCRIPTADO: ', hashedCode);
        yield pool
            .request()
            .input("code", mssql_1.default.VarChar(200), hashedCode)
            .input("id", mssql_1.default.Int, usuario.id)
            .query('INSERT INTO [SECRET_CODE] (code, user_id) VALUES (@code, @id)');
        return res.json({
            code: 200,
            message: 'Código secreto generado correctamente',
            data: {
                email,
                code: secretCode
            }
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al obtener codigo secreto',
            error: error.message
        });
    }
});
exports.getSecretCode = getSecretCode;
const generateRandomCode = () => {
    const min = 100000;
    const max = 999999;
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode.toString();
};
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, secondName = '', fatherLastname, motherLastname, email, password } = req.body;
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool
            .request()
            .input('firstName', mssql_1.default.VarChar(50), firstName)
            .input('secondName', mssql_1.default.VarChar(50), secondName)
            .input('fatherLastname', mssql_1.default.VarChar(50), fatherLastname)
            .input('motherLastname', mssql_1.default.VarChar(50), motherLastname)
            .input('email', mssql_1.default.VarChar(150), email)
            .input('password', mssql_1.default.VarChar(250), hashedPassword)
            .input('status', mssql_1.default.Int, 1)
            .query('INSERT INTO [USER] (firstName, secondName, fatherLastname, motherLastname, email, password, status) ' +
            'VALUES (@firstName, @secondName, @fatherLastname, @motherLastname, @email, @password, @status); ' +
            'SELECT SCOPE_IDENTITY() AS id;');
        res.json({
            code: 200,
            message: 'Usuario creado exitosamente',
            user: {
                id: result.recordset[0].id,
                firstName,
                secondName,
                fatherLastname,
                motherLastname,
                email,
                password: hashedPassword,
                status: 1
            }
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
});
exports.postUser = postUser;
const putUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { firstName, secondName = '', fatherLastname, motherLastname, email, password } = req.body;
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = password ? bcryptjs_1.default.hashSync(password, salt) : null;
        const query = validatePutInfo(req);
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool
            .request()
            .input('id', mssql_1.default.Int, id)
            .input('firstName', mssql_1.default.VarChar(50), firstName)
            .input('secondName', mssql_1.default.VarChar(50), secondName)
            .input('fatherLastname', mssql_1.default.VarChar(50), fatherLastname)
            .input('motherLastname', mssql_1.default.VarChar(50), motherLastname)
            .input('email', mssql_1.default.VarChar(150), email)
            .input('password', mssql_1.default.VarChar(250), hashedPassword)
            .input('status', mssql_1.default.Int, 1)
            .query(query);
        if (result.rowsAffected[0] === 0) {
            return res.json({
                code: 404,
                message: 'Usuario no encontrado'
            });
        }
        return res.json({
            code: 200,
            message: 'Usuario actualizado de manera exitosa',
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
});
exports.putUser = putUser;
const validatePutInfo = (req) => {
    const id = req.params.id;
    const { firstName, secondName, fatherLastname, motherLastname, email, password } = req.body;
    const salt = bcryptjs_1.default.genSaltSync(10);
    const hashedPassword = password ? bcryptjs_1.default.hashSync(password, salt) : '';
    let updateQuery = 'UPDATE [USER] SET ';
    const queryParams = { id };
    if (firstName) {
        updateQuery += 'firstName = @firstName, ';
        queryParams.firstName = firstName;
    }
    if (secondName != null) {
        updateQuery += 'secondName = @secondName, ';
        queryParams.secondName = secondName;
    }
    if (fatherLastname) {
        updateQuery += 'fatherLastname = @fatherLastname, ';
        queryParams.fatherLastname = fatherLastname;
    }
    if (motherLastname) {
        updateQuery += 'motherLastname = @motherLastname, ';
        queryParams.motherLastname = motherLastname;
    }
    if (email) {
        updateQuery += 'email = @email, ';
        queryParams.email = email;
    }
    if (hashedPassword) {
        updateQuery += 'password = @password, ';
        queryParams.password = hashedPassword;
    }
    // Quitar la ultima coma y espacio
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ' WHERE id = @id';
    return updateQuery;
};
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool
            .request()
            .input('id', mssql_1.default.Int, id)
            // .query('UPDATE [USER] SET status = 0 WHERE id = @id;')
            .query('DELETE FROM [USER] WHERE id = @id;');
        if (result.rowsAffected[0] === 0) {
            return res.json({
                code: 404,
                message: 'Usuario no encontrado'
            });
        }
        return res.json({
            code: 200,
            message: 'Usuario eliminado de manera exitosa'
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
});
exports.deleteUser = deleteUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { email, password } = req.body;
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = password ? bcryptjs_1.default.hashSync(password, salt) : null;
        const pool = yield (0, dbConnection_1.dbConnection)();
        const result = yield pool
            .request()
            .input('id', mssql_1.default.Int, id)
            .input('email', mssql_1.default.VarChar(150), email)
            .input('password', mssql_1.default.VarChar(250), hashedPassword)
            .query('UPDATE [USER] SET password = @password ' +
            'WHERE id = @id ' +
            'AND email = @email; ' +
            'UPDATE [SECRET_CODE] SET code_status = 0 WHERE user_id = @id');
        if (result.rowsAffected[0] === 0) {
            return res.json({
                code: 404,
                message: 'Usuario no encontrado'
            });
        }
        return res.json({
            code: 200,
            message: 'Usuario actualizado de manera exitosa',
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
});
exports.changePassword = changePassword;
//# sourceMappingURL=usuarios.controller.js.map