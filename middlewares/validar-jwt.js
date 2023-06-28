const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req = request, res = response, next ) => {
    const token = req.header('Authorization');
    console.log(token);
    console.log(req.headers.authorization);

    // if ( req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    //     token = req.headers.authorization.split(" ")[1];
    //     console.log('TOKEN: ', token);
    // } 
    // else{
    //     return res.status(401).json({
    //         message: 'No se ha detectado Token'
    //     });
    // }

    try {

        const payload = jwt.verify(token, process.env.SECRETORPUBLICKEY);

        console.log(payload);
        
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Token invalido',
        });
    }
}

module.exports = {
    validarJWT
}