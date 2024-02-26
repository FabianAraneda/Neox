import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth.route';
import { dbConnection } from '../database/dbConnection';
import userRoutes from '../routes/usuarios.route';
import sql from 'mssql';

class Server {
    public app: Application;
    public port: string | number;
    public usuariosPath: string;
    public authPath: string;

    constructor() {
        this.app = express();
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

    async conectarDB() {
        await dbConnection();
    }

    private middlewares() {
        // Cors
        this.app.use(cors());
        // Lectura y parse del body
        this.app.use(express.json());
        // Directorio publico
        this.app.use(express.static('public'));
    }

    private routes() {
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.usuariosPath, userRoutes);
    }

    private healthCheck() {
        this.app.get('/healthcheck', (req: Request, res: Response) => {
            res.status(200).send('Servidor en funcionamiento');
        });
    }

    private handleGracefulShutdown() {
        process.on('SIGINT', () => {
            this.shutdown();
        });

        process.on('SIGTERM', () => {
            this.shutdown();
        });
    }

    private shutdown() {
        this.app.close((err: any) => {
            if (err) {
                console.error('Error en el shutdown del servidor:', err);
                process.exit(1);
            } else {
                console.log('Servidor detenido por gracefull shutdown.');
                process.exit(0);
            }
        });

        sql.end(() => {
            console.log('Base de datos desconectada');
        });
    }

    public listen() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`);
        });
    }
}

export default Server;