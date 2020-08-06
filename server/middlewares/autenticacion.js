const jwt = require('jsonwebtoken');

//=========================
//Verificar token
//=========================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};


let verificaAdmin = (req, res, next) => {
    console.log("VERIFICOADMIN")
    let token = req.get('token');

    //console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        console.log(req.usuario.role)

        if (req.usuario.role == "ADMIN_ROLE") {
            console.log("PATATAS POWA")
            next();
        } else {

            return res.status(401).json({
                ok: false,
                err: {
                    message: "TIENES QUE SER ADMIN GILIPOLLAS"
                }
            });
        }


    });

};


module.exports = {
    verificaToken,
    verificaAdmin
}