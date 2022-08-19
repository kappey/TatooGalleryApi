const express = require('express');
const path = require('path');
const http = require('http');
const cors = require ('cors');
const { routesInit, corsAccessControl } = require ("./routes/configRoute");

require ('dotenv').config();
require('./db/mongoConnection');
require ('dotenv').config();

const app = express();
app.use(express.static(path.resolve('./public')))
app.use(express.json());
app.use(cors());

routesInit(app);
corsAccessControl(app);

const server = http.createServer(app);
const PORT = process.env.PORT || "3000";
server.listen(PORT);
