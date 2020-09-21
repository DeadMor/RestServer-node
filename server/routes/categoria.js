const express = require('express');

let { verificaToken } = require("../middlewares/autenticacion")
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
        // .skip(desde)
        // .limit(limite)
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


})

app.delete("/categoria/:id", (req, res) => {


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