const express = require('express');

let { verificaToken, verificaAdmin } = require("../middlewares/autenticacion");
const categoria = require('../models/categoria.js');
let app = express();

let Categoria = require("../models/categoria.js");

// ================================
//  Mostrar todas las categorias
// ================================

app.get("/categoria", (req, res) => {

    // let desde = req.query.desde || 0;
    // desde = Number(desde);

    // let limite = req.query.limite || 5;
    // limite = Number(limite);

    Categoria.find()
        .sort("descripcion")
        // .skip(desde)
        // .limit(limite)
        .populate('usuario', "nombre email")
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });

            })

        })
})

// ================================
//  Mostrar una categoria por id
// ================================
app.get("/categoria/:id", (req, res) => {
    //Categoria.fingById()

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoria
        });

    })

})




// ================================
//  actualizar categoria
// ================================
app.put("/categoria/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})

app.delete("/categoria/:id", [verificaAdmin, verificaToken], (req, res) => {
    let id = req.params.id;

    categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el id no exxiste"
                }
            });
        }

        res.json({
            ok: true,
            message: "categoria borrada"
        })


    })

})


app.post("/categoria", verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

module.exports = app;