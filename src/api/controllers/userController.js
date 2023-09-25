const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../knex");
const { uuid } = require('uuidv4');

// Register new user
exports.userRegister = (req, res) => {
    let newUser = req.body;

    if(newUser.password){

        bcrypt.hash(newUser.password, 10, (error, hash) => {
            if(error){
                res.status(401);
                console.log(error);
                res.json({message: "Impossible to encrypt the password"});
            }
            else{
                db.select("*")
                    .from("user")
                    .where("email", "=", newUser.email)
                    .then((user) => {
                        if(user.length > 0) {
                            res.status(401);
                            res.json({message: "User already exists"});
                        }
                        else {
                             db("user")
                                .insert({
                                    id: uuid(), 
                                    firstName: newUser.firstName, 
                                    lastName: newUser.lastName, 
                                    email: newUser.email, 
                                    password: hash,
                                    interest: newUser.interest !== null ? newUser.interest : null,
                                    location: newUser.location,
                                    description: newUser.description !== null ? newUser.description : null,
                                    phoneNumber: newUser.phoneNumber,
                                    age: newUser.age,
                                    sex: newUser.sex,
                                    lastConnection: newUser.lastConnection !== null ? newUser.lastConnection : null,
                                    connected: "0"
                                })
                                .then(data => {
                                    res.status(200).json({
                                        message: `User created : ${newUser.email}`
                                    })
                                })
                                .catch(error => {
                                    res.status(401);
                                    console.log(error);
                                    res.json({message: "Invalid request"});
                                });
                        }
                    })
            }
        })
    }
    else{
        res.status(401);
        console.log(error);
        res.json({message: "Missing password"});
    }
}

// Login to an existing account
exports.userLogin = (req, res) => {
    db.select('*')
        .from("user")
        .where('email', req.body.email)
        .then((user) => {
            bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                if(error){
                    res.status(401);
                    console.log(error);
                    res.json({message: "Incorrect password"})
                }
                else{
                    let userData = {
                        id: user[0].id,
                        email: user[0].email,
                        password: user[0].password
                    }

                    jwt.sign(userData, process.env.JWT_KEY, {expiresIn: "30 days"}, (error, token) => {
                        if(error){
                            res.status(500);
                            console.log(error);
                            res.json({message: "Impossible to generate a token"})
                        }
                        else{
                            res.status(200);
                            res.json({message: `Connected user : ${user[0].email}`, token, user: userData});
                        }
                    });
                }
            })
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
            res.json({message: "User not found"});
        });
}

// Show list of users
exports.listAllUsers = (req, res) => {
    db("user")
    .select("*")
    .then(data => res.status(200).json({data}))
    .catch(error => {
        res.status(401);
        console.log(error);
        res.json({message: "Server error"});
    });   
}

// User Logout 
exports.userLogout = (req, res) => {
    const userId = req.params.userId;
    const currentTime = new Date();
  
    const updateQuery = `
      UPDATE user
      SET connected = "0", lastConnection = ?
      WHERE id = ?`;
  
    db.raw(updateQuery, [currentTime, userId])
      .then(() => {
        res.status(200).json({ message: `Disconnected user :  ${userId}` });
      })
      .catch((error) => {
        console.error('Error disconnecting :', error);
        res.status(500).json({ message: 'Server error' });
      });
}

// Get the user's information
exports.getUserById = (req, res) => {
    const id = req.params.userId;

    db("user")
        .select("*")
        .then(data => {
            if(id === data.id) {
                res.status(200);
                res.json({message: `User found`, user: data});
            }
            else {
                res.status(500);
                res.json({message: "User not found"});
            }
        })
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });   
}
