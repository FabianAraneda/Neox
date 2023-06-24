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

const existeUsuario = async ( id ) => {
  // Verificar usuario existe
  const usuarioExiste = await Usuario.findById(id);
  if ( !usuarioExiste ) { 
    throw new Error(`El usuario ${ id } no existe`);
  }
}
 
module.exports = {
  validarRol,
  existeEmail,
  existeUsuario
}