const express = require("express");
const cors = require("cors");
const app = express();

global.__basedir = __dirname;

app.use(cors());
app.use(express.json());

const conn = require("./db/conn");

conn();

const routes = require("./routes/router");

app.use("/api", routes);

app.listen(3000, function () {
    console.log("Servidor online na porta 3000!");
});

