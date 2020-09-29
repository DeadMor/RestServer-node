const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");
//const producto = require("../models/producto");

let app = express();

let Producto = require("../models/producto")

//===================================
// OBTENER PRODUCTOS
//==================================

app.get("/productos", (req, res) => {
    //trae todos los productos
    //porpulate usuario categoria
    //paginado
    let desde = req.params.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate("usuario", "nombre email")
        //.populate("categoria", "descripcion")
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.status(201).json({
                ok: true,
                producto: productos
            })
        })

})

//===================================
// OBTENER PRODUCTOS por id
//==================================
app.get("/productos/:id", (req, res) => {
    // populate:usuario categaria


})

//===================================
// AÑADIR PRODUCTOS
//==================================

app.post("/productos/", verificaToken, (req, res) => {

        let body = req.body;

        let producto = new Producto({
            usuario: req.usuario._id,
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: body.categoria
        })

        producto.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.status(201).json({
                ok: true,
                producto: productoDB
            })
        })

    })
    //===================================
    // actualizar productos PRODUCTOS
    //==================================
app.put("/productos/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el producto no existe"
                }
            })
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(201).json({
                ok: true,
                producto: productoGuardado
            })


        })
    })
})

//===================================
// borrar productos PRODUCTOS
//==================================
app.delete("/productos/:id", (req, res) => {

})





module.exports = app;