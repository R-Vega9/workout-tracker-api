require("dotenv").config();
const express = require("express");
const cors = require("cors");
const notFound = require("./src/errors/notFound")
const errorHandler = require('./src/errors/errorHandler')
// const clients = require('./src/data/clients-data')
// const connectDB = require('./src/data/connection')
// const mongoose = require('mongoose')
const clientsRouter = require("./src/clients/clients.router")

const app = express();
// connectDB()
app.use(cors());
app.use(express.json());

// 👇 always-OK health checks (fast, no DB work)
app.get("/healthz", (req, res) => res.status(200).send("ok"));
// optional, helps if Render probes "/" instead of /healthz
app.get("/", (req, res) => res.status(200).send("ok"));

app.use("/clients", clientsRouter)

app.use(notFound);
app.use(errorHandler);


module.exports = app;