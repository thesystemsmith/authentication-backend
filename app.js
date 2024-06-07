const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const cors = require('cors')


//import files
const dbConnect = require('./db/dbConnect')
const User = require('./db/userModel')
const auth = require('./auth')

//execute connection
dbConnect()

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    )
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    )
    next()
})
//by passing the cors issue on a local lift
app.use(cors())

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

//login user
app.post('/login', (req, res) => {
    //find user
    User.findOne({ email: req.body.email })
        .then(user => {
            bcrypt.compare(req.body.password, user.password)
                .then(passwordCheck => {
                    // password did not match?
                    if(!passwordCheck){
                        return res.status(400).send({
                            message: 'password does not match',
                        })
                    }
                    //if password match
                    //create jwt
                    const token = jwt.sign({
                            userId: user._id,
                            userEmail: user.email,
                        },'RANDOM-TOKEN',{expiresIn: '24h'}
                    )
                    //return response
                    res.status(201).send({
                        message: 'login successful',
                        email: user.email,
                        token,
                    })
                })
                .catch(err => {
                    res.status(400).send({
                        message: "something went wrong while comparing passwords",
                        err,
                    })
                })
        })
        .catch(err => {
            res.status(404).send({
                message: "Email not found",
                err,
            })
        })
})


// free endpoint
app.get("/free-endpoint", (req, res) => {
    res.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (req, res) => {
    res.json({ message: "You are authorized to access me" });
});

module.exports = app;