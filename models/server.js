const express = require('express');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Middlewares
        this.middlewares();
        // Rutas
        this.routes();
    }

    middlewares() {
        // Directorio publico
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.get('/api', ( req, res ) => {
            res.json({
                code: 200,
                message: 'OK'
            })
        });

        this.app.get('/api', ( req, res ) => {
            res.json({
                code: 200,
                message: 'OK'
            })
        });

        this.app.get('/api', ( req, res ) => {
            res.json({
                code: 200,
                message: 'OK'
            })
        });
        
        this.app.get('/api', ( req, res ) => {
            res.json({
                code: 200,
                message: 'OK'
            })
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;