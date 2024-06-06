const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

//import files
const dbConnect = require('./db/dbConnect')
const User = require('./db/userModel')

//execute connection
dbConnect()

// body parser configuration
// need this to read the request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//register user
app.post('/register', (req, res) => {
    //hashing the password
    bcrypt.hash(req.body.password, 10)
        .then(hashedPassword => {
            //create user
            const user = new User({
                email: req.body.email,
                password: hashedPassword
            })
            //save user in db
            user.save()
                .then(result => {
                    res.status(201).send({
                        message: "User Created Successfully",
                        result
                    })
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error creating user",
                        err,
                    })
                })
        })
        .catch(err => {
            res.status(500).send({
                message: "Password was not hashed successfully",
                err,
            })
        })
})

module.exports = app;