const jwt = require('jsonwebtoken');
const {User} = require('../models/Schemas');


const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    
    //check json token exist and is verified
    if(token){
        jwt.verify(token, 'netninjasecret', (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.json({
                    status: "failure"
                })
            } else {
                console.log(decodedToken);
                next();
            }
        })
    }

}

//check current user's password
const checkUser = (req, res, next) =>{
    const token = req.cookies.jwt;

    //check json token exist and is verified
    if(token){
        jwt.verify(token, 'netninjasecret', async (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.json({
                    status: "failure"
                })
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                console.log(user);
                next();
            }
           
        })
    } 
    next();
   
}

module.exports = { requireAuth, checkUser}