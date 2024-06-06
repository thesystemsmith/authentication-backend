const express = require("express");
const app = express();

//import db config
const dbConnect = require('./db/dbConnect')

//execute connection
dbConnect()

module.exports = app;