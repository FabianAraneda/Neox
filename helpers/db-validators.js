const Rol = require('../models/rol');
const Usuario = require('../models/usuario');
 
const validarRol = async (rol = '') => { 
    const existeRol = await Rol.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const existeEmail = async ( correo = '' ) => {
  // Verificar si correo existe
  const existeCorreo = await Usuario.findOne( {correo} );
  if (existeCorreo) { 
    throw new Error(`El correo ${ correo } ya se encuentra registrado en la BD`);
  }
}
 
module.exports = {
  validarRol,
  existeEmail
}