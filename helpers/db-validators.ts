import { dbConnection } from "../database/dbConnection";
import sql from 'mssql';
import bcryptjs from 'bcryptjs';

const existeEmailLogin = async (correo: string) => {
  try {
    const pool = await dbConnection();
    const result = await pool.request()
      .input('email', sql.VarChar(150), correo)
      .query('SELECT COUNT(1) AS count FROM [USER] WHERE email = @email;');
    
    if (result.recordset[0].count < 1) {
      throw new Error(`El correo ${correo} NO se encuentra registrado`);
    }
  } catch (error) {
    throw new Error(`Error de verificación de correo: ${error.message}`);
  }
};

const estaBloqueado = async (correo: string) => {
  try {
    const pool = await dbConnection();
    const result = await pool.request()
      .input('email', sql.VarChar(150), correo)
      .query('SELECT status FROM [USER] WHERE email = @email;');
    
    if (result.recordset[0].status === 0) {
      throw new Error(`El usuario ${correo} se encuentra bloqueado`);
    }
  } catch (error) {
    throw new Error(`Error de verificación de correo: ${error.message}`);
  }
};
const existeEmail = async (correo: string) => {
  try {
    const pool = await dbConnection();
    const result = await pool.request()
      .input('email', sql.VarChar(150), correo)
      .query('SELECT COUNT(1) AS count FROM [USER] WHERE email = @email;');
    
    if (result.recordset[0].count > 0) {
      throw new Error(`El correo ${correo} ya se encuentra registrado en la BD`);
    }
  } catch (error) {
    throw new Error(`Error de verificación de correo: ${error.message}`);
  }
};

const existeUsuario = async (id: number) => {
  try {
    const pool = await dbConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT COUNT(1) AS count FROM [USER] WHERE id = @id;');

    if (result.recordset[0].count < 1) {
      throw new Error(`El usario con id ${id} NO existe`);
    }
  } catch (error) {
    throw new Error(`Error de verificación de usuario: ${error.message}`);
  }
};

const existeCodigo = async (code: string, { req }) => {
  try {
    const { id }  = req.params;

    const pool = await dbConnection();
    const result = await pool.request()
      .input('user_id', sql.Int, Number.parseInt(id))
      .query('SELECT * FROM [SECRET_CODE] ' +
        'WHERE user_id = @user_id ' +
        'AND code_status = 1');

    if(!result.recordset[0]){
      throw new Error(`El código secreto no existe para el usuario ${id}`);
    }

    const validCode = bcryptjs.compareSync(code, result.recordset[0].code);

    if (!validCode) {
      throw new Error(`El código secreto no existe para el usuario ${id}`);
    }

  } catch (error) {
    throw new Error(`Error de verificación de correo: ${error.message}`);
  }
};


export { existeEmailLogin, estaBloqueado, existeEmail, existeUsuario, existeCodigo };
