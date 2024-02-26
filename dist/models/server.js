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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const dbConnection_1 = require("../database/dbConnection");
const usuarios_route_1 = __importDefault(require("../routes/usuarios.route"));
const mssql_1 = __importDefault(require("mssql"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 3000;
        this.usuariosPath = '/api/user';
        this.authPath = '/api/auth';
        // Conexion BD
        this.conectarDB();
        // // Middlewares
        this.middlewares();
        // // Rutas
        this.routes();
        // Healthcheck
        this.healthCheck();
    }
    conectarDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, dbConnection_1.dbConnection)();
        });
    }
    middlewares() {
        // Cors
        this.app.use((0, cors_1.default)());
        // Lectura y parse del body
        this.app.use(express_1.default.json());
        // Directorio publico
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.authPath, auth_route_1.default);
        this.app.use(this.usuariosPath, usuarios_route_1.default);
    }
    healthCheck() {
        this.app.get('/healthcheck', (req, res) => {
            res.status(200).send('Servidor en funcionamiento');
        });
    }
    handleGracefulShutdown() {
        this.app.close((err) => {
            if (err) {
                console.error('Error en el shutdown del servidor:', err);
                process.exit(1);
            }
            else {
                console.log('Servidor detenido por gracefull shutdown.');
                process.exit(0);
            }
        });
        mssql_1.default.end(() => {
            console.log('Base de datos desconectada');
        });
    }
    listen() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map