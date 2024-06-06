const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try{
        //   get the token from the authorization header
        const token = await req.headers.authorization.split(' ')[1]
        
        //check if the token matches the supposed origin
        const decodedToken = await jwt.verify(token, 'RANDOM-TOKEN')

        // retrieve the user details of the logged in user
        const user = await decodedToken

        // pass the user down to the endpoints here
        req.user = user

        //pass down the functionality 
        next()
    }catch(err){
        res.status(401).json({
            error: new Error('not authorised')
        })
    }
}