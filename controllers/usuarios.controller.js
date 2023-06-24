const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const getUsuarios = async ( req = request, res = response ) => {

    // const params = req.query;
    const { limit = 5, from = 0 } = req.query;
    const activo = { activo: true };

    // Ejecuta un arreglo de promesas de manera simultanea; si una da error, todas producen error
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( activo ),
        Usuario.find( activo )
                .skip(Number(from))
                .limit(Number(limit))
    ]);

    res.json({
        code: 200,
        total,
        usuarios
    })
};

const putUsuarios = async ( req = request, res = response ) => {

    const id = req.params.id;
    const { _id, password, google, correo,  ...resto } = req.body;

    if ( password ) {
        // Escriptar password
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        code: 200,
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
        usuario
    })
};

const deleteUsuarios = async ( req = request, res = response ) => {

    const { id } = req.params;

    // Borrar registro de la BBDD
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate( id, { activo: false } );

    res.json({
        code: 200,
        usuario
    })
};



module.exports = {
    getUsuarios,
    putUsuarios,
    postUsuarios,
    deleteUsuarios
}