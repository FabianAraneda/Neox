const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usuariosPath = '/api/usuarios';

        // Conexion BD
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        // Cors
        this.app.use( cors() );
        // Lectura y parse del body
        this.app.use( express.json() );
        // Directorio publico
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use( this.usuariosPath , require('../routes/usuarios.route') );
    }

    listen() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;
