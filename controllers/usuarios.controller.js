const { response, request } = require('express');


const getUsuarios = ( req = request, res = response ) => {

    const params = req.query;

    res.json({
        code: 200,
        message: 'Get method desde controlador',
        params
    })
};

const putUsuarios = ( req = request, res = response ) => {

    const id = req.params.id;

    res.json({
        code: 200,
        message: 'Put method',
        id
    })
};

const postUsuarios = ( req = request, res = response ) => {
    const body = req.body;

    res.json({
        code: 200,
        message: 'Post method',
        body
    })
};

const deleteUsuarios = ( req = request, res = response ) => {
    res.json({
        code: 200,
        message: 'Delete method'
    })
};



module.exports = {
    getUsuarios,
    putUsuarios,
    postUsuarios,
    deleteUsuarios
}