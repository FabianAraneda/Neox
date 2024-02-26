import { Router } from 'express';
import { check } from 'express-validator';
import { login } from '../controllers/auth.controller';
import { validaCampos } from '../middlewares/validar-campos';
import { estaBloqueado, existeEmailLogin } from '../helpers/db-validators';

const router = Router();

router.post(
  '/login',
  [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email').custom(existeEmailLogin),
    check('email').custom(estaBloqueado),
    validaCampos,
  ],
  login
);

export default router;
