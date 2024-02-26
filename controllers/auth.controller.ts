import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../helpers/generar-jwt';
import { dbConnection } from '../database/dbConnection';
import sql from 'mssql';

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;


        const pool = await dbConnection();
        const result = await pool
            .request()
            .input('email', sql.VarChar(150), email)
            .query("SELECT id, email, password, firstName + ' ' + fatherLastname AS name FROM [USER] WHERE email = @email");


        const usuario = {
            id:  result.recordset[0].id,
            email: result.recordset[0].email, 
            password: result.recordset[0].password,
            name: result.recordset[0].name
        }

        //Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                message: 'Usuario / Contraseña incorrectos'
            });
        }

        // Generar Token
        const token = await generarJWT(usuario.id, usuario.name, usuario.email);

        res.json({
            msg: 'OK',
            usuario,
            token
        });
    } catch (error) {
        res.status(500).json({
            message: `Algo sali+o mal ${error}`
        });
    }
};

export { login };
