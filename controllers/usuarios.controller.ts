import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { dbConnection } from '../database/dbConnection';
import sql from 'mssql';

const getUsers = async (req: Request, res: Response) => {
    try {

        const pool = await dbConnection();
        const result = await pool.request().query('SELECT * FROM [USER]');

        if(result.rowsAffected[0] === 0){
            return  res.status(404).send({
                code: 404,
                message : 'No se encontraron usuarios'
            });
        }

        return res.json({
            code: 200,
            total: result.recordset.length,
            usuarios: result.recordset
        });

    } catch (error) {

        res.status(500).json({
            code: 500,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

const getUser = async (req: Request, res: Response) => {
    try {

        const pool = await dbConnection();
        const result = await pool.request()
            .input('email', sql.VarChar(50), req.params.id)
            .query('SELECT * FROM [USER] WHERE email = @email');

        if(result.rowsAffected[0] === 0){
            return  res.status(404).send({
                code : 404,
                message : "No se ha encontrado el usuario"
            });
        }    

        return res.json({
            code: 200,
            usuarios: result.recordset
        });

    } catch (error) {

        res.status(500).json({
            code: 500,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

const getSecretCode = async (req: Request, res: Response) => {
    try {

        const email = req.params.email;

        const pool = await dbConnection();
        const result = await pool
            .request()
            .input('email', sql.VarChar(150), email)
            .query('SELECT * FROM [USER] WHERE email = @email');

        const usuario = {
            id:  result.recordset[0].id,
            firstName: result.recordset[0].firstName,
            secondName: result.recordset[0].secondName,
            fatherLastname: result.recordset[0].fatherLastname,
            motherLastname: result.recordset[0].motherLastname,
            email: result.recordset[0].email, 
            password: result.recordset[0].password
        }

        const secretCode = generateRandomCode();
        console.log('CODIGO SECRETO: ', secretCode);

        const salt = bcryptjs.genSaltSync(10);
        const hashedCode = bcryptjs.hashSync(secretCode, salt);
        console.log('CODIGO SECRETO ENCRIPTADO: ', hashedCode);


        await pool
            .request()
            .input("code", sql.VarChar(200), hashedCode)
            .input("id", sql.Int, usuario.id)
            .query('INSERT INTO [SECRET_CODE] (code, user_id, code_status) VALUES (@code, @id, 1)');


        return res.json({
            code: 200,
            message:  'Código secreto generado correctamente',
            data: {
                email,
                code: secretCode
            }
        });

    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al obtener codigo secreto',
            error: error.message
        });
    }
};

const generateRandomCode = (): string => {
    const min = 100000;
    const max = 999999; 
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode.toString(); 
}

const postUser = async (req: Request, res: Response) => {
    try {

        const { firstName, secondName = '', fatherLastname, motherLastname, email, password } = req.body;
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const pool = await dbConnection();
        const result = await pool
            .request()
            .input('firstName', sql.VarChar(50), firstName)
            .input('secondName', sql.VarChar(50), secondName)
            .input('fatherLastname' ,sql.VarChar(50), fatherLastname)
            .input('motherLastname', sql.VarChar(50), motherLastname)
            .input('email', sql.VarChar(150), email)
            .input('password', sql.VarChar(250), hashedPassword)
            .input('status', sql.Int, 1)
            .query('INSERT INTO [USER] (firstName, secondName, fatherLastname, motherLastname, email, password, status) ' +
                'VALUES (@firstName, @secondName, @fatherLastname, @motherLastname, @email, @password, @status); ' +
                'SELECT SCOPE_IDENTITY() AS id;');

        res.json({
            code: 200,
            message: 'Usuario creado exitosamente',
            user: {
                id: result.recordset[0].id,
                firstName,
                secondName,
                fatherLastname,
                motherLastname,
                email,
                password: hashedPassword,
                status: 1
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

const putUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { firstName, secondName = '', fatherLastname, motherLastname, email, password } = req.body;

        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = password ? bcryptjs.hashSync(password, salt) : null;

        const query = validatePutInfo(req);
    
        const pool = await dbConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .input('firstName', sql.VarChar(50), firstName)
            .input('secondName', sql.VarChar(50), secondName)
            .input('fatherLastname' ,sql.VarChar(50), fatherLastname)
            .input('motherLastname', sql.VarChar(50), motherLastname)
            .input('email', sql.VarChar(150), email)
            .input('password', sql.VarChar(250), hashedPassword)
            .input('status', sql.Int, 1)
            .query(query);

        if(result.rowsAffected[0] === 0){
            return res.json({
                code: 404,
                message: 'Usuario no encontrado'
            });
        }

        return res.json({
            code: 200,
            message: 'Usuario actualizado de manera exitosa',
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

const validatePutInfo = (req: Request): string => {
    const id = req.params.id;
        const { firstName, secondName, fatherLastname, motherLastname, email, password } = req.body;

        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = password ? bcryptjs.hashSync(password, salt) : '';
    
        let updateQuery = 'UPDATE [USER] SET ';
        const queryParams: { [key: string]: any } = { id };

        if (firstName) {
            updateQuery += 'firstName = @firstName, ';
            queryParams.firstName = firstName;
        }

        if (secondName != null) {
            updateQuery += 'secondName = @secondName, ';
            queryParams.secondName = secondName;
        }

        if (fatherLastname) {
            updateQuery += 'fatherLastname = @fatherLastname, ';
            queryParams.fatherLastname = fatherLastname;
        }

        if (motherLastname) {
            updateQuery += 'motherLastname = @motherLastname, ';
            queryParams.motherLastname = motherLastname;
        }

        if (email) {
            updateQuery += 'email = @email, ';
            queryParams.email = email;
        }

        if (hashedPassword) {
            updateQuery += 'password = @password, ';
            queryParams.password = hashedPassword;
        }

        // Quitar la ultima coma y espacio
        updateQuery = updateQuery.slice(0, -2);

        updateQuery += ' WHERE id = @id';

        return updateQuery;
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const pool = await dbConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('DELETE FROM [USER] WHERE id = @id;');


        if(result.rowsAffected[0] === 0){
            return res.json({
                code: 404,
                message: 'Usuario no encontrado'
            });
        }

        return res.json({
            code: 200,
            message: 'Usuario eliminado de manera exitosa'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

const changePassword = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { email, password } = req.body;

        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = password ? bcryptjs.hashSync(password, salt) : null;
    
        const pool = await dbConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .input('email', sql.VarChar(150), email)
            .input('password', sql.VarChar(250), hashedPassword)
            .query('UPDATE [USER] SET password = @password '+
                'WHERE id = @id '+
                'AND email = @email; '+
                'UPDATE [SECRET_CODE] SET code_status = 0 WHERE user_id = @id');

        if(result.rowsAffected[0] === 0){
            return res.json({
                code: 404,
                message: 'Usuario no encontrado'
            });
        }

        return res.json({
            code: 200,
            message: 'Contraseña actualizada de manera exitosa',
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

export { getUser, getUsers, postUser, putUser, deleteUser, changePassword, getSecretCode };
