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
exports.dbConnection = void 0;
const mssql_1 = __importDefault(require("mssql"));
const dbSetting = {
    dialect: 'mssql',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    server: 'localhost',
    port: 1434,
    database: 'Neox',
    user: 'test',
    password: 'test',
};
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield mssql_1.default.connect(dbSetting);
    }
    catch (error) {
        console.error('Error al conectar la base de datos:', error);
        throw new Error('Error al conectar la base de datos');
    }
});
exports.dbConnection = dbConnection;
//# sourceMappingURL=dbConnection.js.map