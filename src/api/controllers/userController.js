const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../knex");
const { uuid } = require('uuidv4');
let { AgeFromDateString } = require('age-calculator');
const nodemailer = require('nodemailer')
const crypto = require('crypto');

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
                            const token = crypto.randomBytes(16).toString('hex');

                             db("user")
                                .insert({
                                    id: uuid(), 
                                    firstName: newUser.firstName, 
                                    lastName: newUser.lastName, 
                                    email: newUser.email, 
                                    password: hash,
                                    location: newUser.location,
                                    description: newUser.description !== null ? newUser.description : null,
                                    phoneNumber: newUser.phoneNumber,
                                    birthday: newUser.birthday,
                                    age: new AgeFromDateString(newUser.birthday).age,
                                    sex: newUser.sex,
                                    lastConnection: newUser.lastConnection !== null ? newUser.lastConnection : null,
                                    connected: "0",
                                    profileImage: null,
                                    verifyEmailToken: token,
                                    emailVerified: false
                                })
                                .then(data => {
                                    exports.sendVerificationMail(newUser.email, token);

                                    res.status(200).json({
                                        message: `User created : ${newUser.email}`,
                                        user: newUser
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
        res.json({message: "Missing password", error: req.body});
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
                    res.json({message: "Incorrect password"})
                }
                else{
                    let userData = {
                        id: user[0].id,
                        email: user[0].email,
                        password: user[0].password,
                    }

                    jwt.sign(userData, process.env.JWT_KEY, {expiresIn: "14 days"}, (error, token) => {
                        if(error){
                            res.status(500);
                            res.json({message: "Impossible to generate a token"});
                        }
                        else{
                            db("user")
                                .update({connected: "1"})
                                .where("id", user[0].id)
                                .then(() => {
                                    res.status(200);
                                    res.json({message: `Connected user : ${user[0].email}`, token, user: userData});
                                })
                                .catch((error) => {
                                    res.status(500);
                                    res.json({message: "Impossible to generate a token"});
                                })
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

// Show list of users
exports.listAllUsers = (req, res) => {
    db("user")
    .select("*")
    .orderBy("firstName", "asc")
    .then(data => res.status(200).json({data}))
    .catch(error => {
        res.status(401);
        console.log(error);
        res.json({message: "Server error"});
    });   
}

// Get the user's information
exports.getUserById = (req, res) => {
    const id = req.params.userId;

    db("user")
        .select("*")
        .then(datas => {
            datas.map((data) => {
                 if(id === data.id) {
                    res.status(200);
                    res.json({message: `User found`, user: data});
                }
            })
        })
        .catch(error => {
            res.status(500);
            res.json({message: "Server error"});
        });   
}

// Update the user's information
exports.updateUserById = (req, res) => {
    const id = req.params.userId;
    const newData = req.body;

    db("user")
        .select("*")
        .where("id", id)
        .then((user) => {
            bcrypt.hash(newData.password, 10, (error, hash) => {
                if(error){
                    res.status(401);
                    console.log(error);
                    res.json({message: "Impossible to encrypt the password"});
                }
                else{
                    db("user")
                        .update({
                            firstName: newData.firstName !== null ? newData.firstName : user[0].firstName, 
                            lastName: newData.lastName !== null ? newData.firstName : user[0].firstName, 
                            email: newData.email !== null ? newData.email : user[0].email, 
                            password: newData.password !== null ? hash : user[0].password,
                            location: newData.location !== null ? newData.firstName : user[0].firstName,
                            description: newData.description !== null ? newData.description : user[0].description,
                            phoneNumber: newData.phoneNumber !== null ? newData.phoneNumber : user[0].phoneNumber,
                            age: newData.age !== null ? newData.age : user[0].age,
                            sex: newData.sex !== null ? newData.sex : user[0].sex,
                            lastConnection: user[0].lastConnection,
                            connected: user[0].connected,
                            verifyEmailToken: user[0].verifyEmailToken,
                            emailVerified: user[0].em
                        })
                        .where("id", id)
                        .then(data => {
                            res.status(200);
                            res.json({message: `User's data is being updated successfully`});
                        })
                        .catch(error => {
                            res.status(500);
                            res.json({message: "User not found"});
                        });   
                }
            })
        })
        .catch(error => {
            res.status(500);
            res.json({message: "User not found"});
        });   
    
}

// Update user's password
exports.updateUserPasswordById = (req, res) => {
    const id = req.params.userId;
    const password = req.body.password;
    
    bcrypt.hash(password, 10, (error, hash) => {
       if(error){
          res.status(401);
          console.log(error);
          res.json({message: "Impossible to encrypt the password"});
       }
       else{
          db("user")
              .update("password", hash)
              .where("id", id)
              .then(data => {
                  res.status(200);
                  res.json({message: `User's password is updated successfully'`});
              })
              .catch(error => {
                  res.status(401);
                  console.log(error);
                  res.json({message: "User not found"});
              });    
       }
    });
}

// Update user's description
exports.updateUserDescriptionById = (req, res) => {
    const id = req.params.userId;
    const description = req.body.description;
    
    db("user")
        .update("description", description)
        .where("id", id)
        .then(data => {
            res.status(200);
            res.json({message: `User's description is updated successfully'`});
        })
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "User not found"});
        });
}

// Delete user by id
exports.deleteUserById =(req,res) => {
    const userId = req.params.userId;
    const deleteQuery = `DELETE FROM user 
                        WHERE id = ?`;
    db.raw(deleteQuery, [userId])
      .then(() => {
        res.status(200).json({ message: ` The user with ID ${userId} has been deleted ` });
      })
      .catch((error) => {
        console.error('Deletion error :', error);
        res.status(500).json({ message: 'Server error' });
      });
}

// Send email to user for email verification
exports.sendVerificationMail = async(to, token) =>{

    let mailOptions = ({
        from: process.env.VIAMI_EMAIL,
        to: to,
        subject: "Vérification de l'adresse e-mail Viami",
        html: `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vérifiez votre adresse e-mail</title>
            </head>
            <body>
                <div style="font-family: Arial, sans-serif; text-align: justify; max-width: 600px; margin: 0 auto; background-color: #E5F3FF;">
                    <div style="background-color: #0081CF; text-align: center; padding: 10px; color: white">
                        <img src="${process.env.CDN_URL}/assets/logo.png" style="width: 250px; height: auto"/>
                    </div>

                    <div style="padding: 5px 20px;">
                        <h3>Vérifiez votre adresse e-mail</h3>
                        <p>Merci de vous être inscrit sur Viami. Pour finaliser votre inscription, veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse e-mail.</p>
                        <div style="margin: auto;">
                            <a href="${process.env.API_URL}/verify?token=${token}" style="text-decoration: none;">
                                <button style="margin: auto; color: white; background-color: #0081CF; border-radius: 10px; border: 1px solid #0081CF; padding: 10px 20px; font-weight: bold;">Vérifier mon e-mail</button>
                            </a>
                        </div>
                        <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller l'URL suivante dans la barre d'adresse de votre navigateur web :</p>
                        <p><a href="${process.env.API_URL}/verify?token=${token}">${process.env.API_URL}/verify?token=${token}</a></p>
                    </div>
                </div>
            </body>
            </html>
        `});
   
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.VIAMI_EMAIL,
          pass: process.env.VIAMI_PASSWORD,
        },
      });
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(401);
            res.json({message: `Error sending verification email`});
        } else {
            res.status(200);
            res.json({message: `Verification email sent`});
        }
    }); 
}

// Verified user's email by token
exports.verifiedEmailUserByToken = (req, res) => {
    const token = req.query.token;
    
    db("user")
        .update("emailVerified", true)
        .where("verifyEmailToken", token)
        .then(data => {
            
            db("user")
                .select("*")
                .where("verifyEmailToken", token)
                .then((user) => {
                    exports.sendEmailVerified(user.id);

                })
                .catch((error) => {
                    console.log(error);
                    res.status(401);
                    res.json({message: "User not found"});
                })
        })
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "User not found"});
        });
}

// Send an email to user when email is verified successfully
exports.sendEmailVerified = async(to) =>{

    let mailOptions = ({
        from: process.env.VIAMI_EMAIL,
        to: to,
        subject: "Viami",
        html: `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Viami</title>
            </head>
            <body>
                <div style="font-family: Arial, sans-serif; text-align: justify; max-width: 600px; margin: 0 auto; background-color: #E5F3FF;">
                    <div style="background-color: #0081CF; text-align: center; padding: 10px; color: white">
                        <img src="${process.env.CDN_URL}/assets/logo.png" style="width: 250px; height: auto"/>
                    </div>

                    <div style="padding: 5px 20px;">
                        <p>Bienvenue sur Viami. Merci d'avoir créé un compte Viami. Votre adresse e-mail a été vérifiée avec succès. Vous pouvez maintenant accéder à votre compte.</p>
                    </div>
                </div>
            </body>
            </html>
        `});
   
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.VIAMI_EMAIL,
          pass: process.env.VIAMI_PASSWORD,
        },
      });
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(401);
            res.json({message: `Error sending verification email`});
        } else {
            res.status(200);
            res.json({message: `Verification email sent`});
        }
    }); 
}