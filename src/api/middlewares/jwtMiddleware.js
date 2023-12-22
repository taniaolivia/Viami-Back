const jwt = require('jsonwebtoken');

const jwtKey = process.env.JWT_KEY;

exports.authenticateUser = (req, res, next) => {
    let token = req.headers['authorization'] || req.body.token || req.query.token;

    if(token !== undefined){
        jwt.verify(token, jwtKey, (error, user) => {
            if(error){
                res.status(403);
                res.json({message: "Forbidden access : Invalid token"})
            }
            else{
                next();
            }
        })
    }
    else{
        res.status(403);
        res.json({message: "Forbidden access : Missing token"});
    }
}