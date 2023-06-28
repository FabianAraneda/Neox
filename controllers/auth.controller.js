const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async ( req = request, res = response ) => {

    const { correo, password } = req.body;

    try {

        // Verificar correo / usuario
        const usuario = await Usuario.findOne( {correo} );
        if ( !usuario || !usuario.activo ) {
            return res.status(400).json({
                message: 'Usuario / Password no son correctos'
            });
        }

        // Verificar password
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                message: 'Usuario / Password no son correctos'
            });
        }

        // Generar Token
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'OK',
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Algo salió mal"
        });
    }
}


module.exports = {
    login
}