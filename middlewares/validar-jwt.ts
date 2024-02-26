import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const validarJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) :authHeader;

    try {
        if (!token) {
            return res.status(401).json({
                code: 401,
                message: 'No hay token en la petición',
            });
        }

        jwt.verify(token, process.env.SECRETORPUBLICKEY as string); // Asigna el tipo string a process.env.SECRETORPUBLICKEY

        next();

    } catch (error) {
        res.status(401).json({
            code: 401,
            message: 'Token inválido',
        });
    }
};

export { validarJWT };
