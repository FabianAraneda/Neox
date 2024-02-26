import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const validaCampos = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    // Continuar con el siguiente middleware o controlador
    next();
};

export { validaCampos };