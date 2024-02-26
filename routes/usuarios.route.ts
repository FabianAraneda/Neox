import { Router } from 'express';
import { check } from 'express-validator';
import {
  getUser,
  getUsers,
  postUser,
  putUser,
  deleteUser,
  changePassword,
  getSecretCode
} from '../controllers/usuarios.controller';
import { existeCodigo, existeEmail, existeEmailLogin, existeUsuario } from '../helpers/db-validators';
import { validaCampos } from '../middlewares/validar-campos';
import { validarJWT } from '../middlewares/validar-jwt';

const router = Router();

router.get('/:id', [validarJWT], getUser);

router.get('/', [validarJWT], getUsers);

router.get(
  '/getSecretCode/:email', 
  [
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email').custom(existeEmailLogin)
  ],
  getSecretCode
);

router.post(
  '/',
  [
    validarJWT,
    check('firstName', 'El primer nombre es obligatorio').not().isEmpty(),
    check('fatherLastname', 'El apellido paterno es obligatorio').not().isEmpty(),
    check('motherLastname', 'El apellido materno es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener 6 o más caracteres').isLength({
      min: 6
    }),
    check('email').custom(existeEmail),
    validaCampos
  ],
  postUser
);

router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un id valido').isInt(),
    check('id').custom(existeUsuario),
    validaCampos
  ],
  putUser
);

router.put(
  '/changePassword/:id',
  [
    check('id', 'No es un id valido').isInt(),
    check('id').custom(existeUsuario),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email').custom(existeEmailLogin),
    check('code').custom(existeCodigo),
    check('code', 'El codigo secreto es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener 6 o más caracteres').isLength({min: 6}),
    validaCampos
  ],
  changePassword
);

router.delete(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un id valido').isInt(),
    check('id').custom(existeUsuario),
    validaCampos
  ],
  deleteUser
);


export default router;
