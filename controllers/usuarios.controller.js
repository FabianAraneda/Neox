const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const getUsuarios = ( req = request, res = response ) => {

    const params = req.query;

    res.json({
        code: 200,
        message: 'Get method desde controlador',
        params
    })
};

const putUsuarios = async ( req = request, res = response ) => {

    const id = req.params.id;
    const { password, google, correo,  ...resto } = req.body;

    if ( password ) {
        // Escriptar password
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        code: 200,
        message: 'Put method',
        usuario
    })
};

const postUsuarios = async ( req = request, res = response ) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Escriptar password
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar usuario a la bbdd
    await usuario.save();

    // Enviar respuesta
    res.json({
        code: 200,
        message: 'Post method',
        usuario
    })
};

const deleteUsuarios = ( req = request, res = response ) => {
    res.json({
        code: 200,
        message: 'Delete method'
    })
};



module.exports = {
    getUsuarios,
    putUsuarios,
    postUsuarios,
    deleteUsuarios
}