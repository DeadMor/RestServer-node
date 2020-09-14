require("./config/config")
const express = require('express')
const path = require('path')
const app = express()

const mongoose = require("mongoose");
const bodyParser = require("body-parser")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//configuracion global de rutas
app.use(require("./routes/index"));

app.use(express.static(path.resolve(__dirname, '../public')))


mongoose.connect(process.env.URLDB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
    (error, resp) => {
        if (error) throw error;
        console.log("Conectado a la base de datos correctamente")
    })

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto 3000");
})