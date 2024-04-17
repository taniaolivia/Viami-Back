const jwt = require('jsonwebtoken');

const jwtKey = process.env.JWT_KEY;

exports.authenticateUser = (req, res, next) => {
    let token = req.headers['authorization'] || req.body.token || req.query.token;

   // console.log('Token:', token); // Vérifiez si le token est correctement récupéré

    if(token !== undefined){
        jwt.verify(token, jwtKey, (error, user) => {
            if(error){
                console.error('JWT Error:', error); // Log de l'erreur JWT
                res.status(403);
                res.json({message: "Forbidden access : Invalid token"})
            }
            else{
                //console.log('User:', user); // Log de l'utilisateur extrait du token
                next();
            }
        })
    }
    else{
        res.status(403);
        res.json({message: "Forbidden access : Missing token"});
    }
}
