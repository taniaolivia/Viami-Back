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
                db("user")
                    .select("*")
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
                                    emailVerified: "0"
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
    db("user")
        .select("*")
        .where('email', req.body.email)
        .then((user) => {
            if (req.body.password !== null || req.body.password !== "") {
                bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                    
                    if(result === true){
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
                    else{
                        res.status(401);
                        res.json({message: "Incorrect password"})
                    }
                })
            }
            else{
                res.status(401);
                console.log(error);
                res.json({message: "Missing password", error: req.body});
            }
            
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
                            lastName: newData.lastName !== null ? newData.lastName : user[0].lastName, 
                            email: newData.email !== null ? newData.email : user[0].email, 
                            password: newData.password !== null ? hash : user[0].password,
                            location: newData.location !== null ? newData.location : user[0].location,
                            description: newData.description !== null ? newData.description : user[0].description,
                            phoneNumber: newData.phoneNumber !== null ? newData.phoneNumber : user[0].phoneNumber,
                            age: newData.age !== null ? newData.age : user[0].age,
                            sex: newData.sex !== null ? newData.sex : user[0].sex,
                            lastConnection: user[0].lastConnection,
                            connected: user[0].connected,
                            verifyEmailToken: user[0].verifyEmailToken,
                            emailVerified: user[0].emailVerified
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

// Update user's password by id
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
              .update(password, "test")
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

// Update user's password by email
exports.updateUserPasswordByEmail = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    db("user")
        .select("*")
        .where("email", email)
        .then((user) => {
            bcrypt.hash(password, 10, (error, hash) => {
                console.log(error);
                if(error){
                    res.status(401);
                    console.log(error);
                    res.json({message: "Impossible to encrypt the password"});
                }
                else{
                    db("user")
                        .update({"password": hash})
                        .where("id", user[0].id)
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
        });
}

// Update user's description by id
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
                    <div style="font-family: Arial, sans-serif; text-align: justify; margin: 0 auto; background-color: #E5F3FF;">
                        <div style="background-color: #0081CF; text-align: center; padding: 10px; color: white">
                            <img src="${process.env.CDN_URL}/assets/logo.png" style="width: 250px; height: auto"/>
                        </div>

                        <div style="padding: 5px 20px;">
                            <h2>Prêt à embarquer ?</h2>
                            <br>
                            <p>
                                Nous sommes ravis de vous accueillir sur Viami, l'application qui réunit les voyageurs solitaires en quête d'aventures et de découvertes ! 
                                Pour finaliser votre inscription et commencer à vivre des expériences uniques, il est essentiel de vérifier votre adresse e-mail. 
                                Cela nous permettra de garantir la sécurité de votre compte et de vous connecter avec d'autres voyageurs passionnés.
                            </p>
                            <p>Pour vérifier votre adresse e-mail et commencer votre voyage avec Viami, il vous suffit de cliquer sur le bouton ci-dessous :</p>
                            <div style="margin: auto;">
                                <a href="${process.env.API_URL}/verify?token=${token}" style="text-decoration: none;">
                                    <button style="margin: auto; color: white; background-color: #0081CF; border-radius: 10px; border: 1px solid #0081CF; padding: 10px 20px; font-weight: bold;">Vérifier mon e-mail</button>
                                </a>
                            </div>
                            <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
                            <p><a href="${process.env.API_URL}/verify?token=${token}">${process.env.API_URL}/verify?token=${token}</a></p>
                            <p>Nous sommes impatients de vous voir embarquer pour cette incroyable aventure avec Viami, où chaque destination devient une opportunité de rencontres extraordinaires.</p>
                            <br>
                            <p>Cordialement,</p>
                            <p>L'équipe Viami</p>
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
        .update("emailVerified", "1")
        .where("verifyEmailToken", token)
        .then(data => {
            db("user")
                .select("*")
                .where("verifyEmailToken", token)
                .then((user) => {
                    exports.sendEmailVerified(user[0].email);
                })
                .catch((error) => {
                    console.log(error);
                    res.status(401);
                    res.json({message: "User not found"});
                })
        
            const htmlResponse = `
                <!DOCTYPE html>
                <html lang="fr">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Email Vérifié</title>
                    </head>
                    <body>
                        <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto;">
                            <h1>Email Vérifié</h1>
                            <p>Votre adresse e-mail a été vérifiée avec succès.</p>
                            <p>Vous pouvez maintenant accéder à votre compte.</p>
                        </div>
                    </body>
                </html>
            `;

            res.send(htmlResponse);
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
        subject: "Bienvenue sur Viami !",
        html: `
            <!DOCTYPE html>
            <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Viami</title>
                </head>
                <body>
                    <div style="font-family: Arial, sans-serif; text-align: justify; margin: 0 auto; background-color: #E5F3FF;">
                        <div style="background-color: #0081CF; text-align: center; padding: 10px; color: white">
                            <img src="${process.env.CDN_URL}/assets/logo.png" style="width: 250px; height: auto"/>
                        </div>

                        <div style="padding: 5px 20px;">
                            <h3>Bienvenue sur Viami !</h3> 
                            <br>
                            <p>
                                Nous sommes ravis de vous informer que votre adresse e-mail a été vérifiée avec succès. 
                                Vous avez désormais franchi une étape cruciale pour profiter pleinement de votre expérience sur Viami, 
                                l'application de rencontre entre voyageurs solitaires.
                            </p>
                            <p>Votre compte est désormais sécurisé, et vous êtes prêt(e) à vivre des aventures passionnantes avec d'autres voyageurs intrépides.</p>
                            <p>Merci d'avoir choisi Viami pour vos voyages en solitaire. Nous sommes honorés de faire partie de vos expériences de voyage et avons hâte de voir où vous nous emmènerez !</p>
                            <p>Bon voyage et à bientôt sur Viami !</p>
                            <br>
                            <p>Cordialement,</p>
                            <p>L'équipe Viami</p>
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
            res.json({message: `Error sending email`});
        } else {
            res.status(200);
            res.json({message: `Email sent`});
        }
    }); 
}

exports.forgetPassword = async(req, res) => {
    const to = req.body.email;

    let mailOptions = ({
        from: process.env.VIAMI_EMAIL,
        to: to,
        subject: "Réinitialisation de votre mot de passe",
        html: `
            <!DOCTYPE html>
            <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Réinitialisation de votre mot de passe</title>
                </head>
                <body style="font-family: Arial, sans-serif; text-align: justify; background-color: white; padding: 0; margin: 0;">
                    <div style="margin: 0 auto;  background-color: #f1eee8; width: 100%; max-width: 600px;">
                        <div style="background-color: #0081CF; text-align: center; padding: 10px; color: white;">
                            <img src="${process.env.CDN_URL}/assets/logo.png" style="width: 250px; height: auto"/>
                        </div>

                        <div style="padding: 5px 20px;">
                            <h3>Bonjour,</h3>
                            <p></p>
                            <p> Si vous avez bien demandé la réinitialisation de votre mot de passe, veuillez cliquer sur le bouton ci-dessous :</p>
                            <a href="${process.env.API_URL}/newPasswordForm?email=${to}" style="text-decoration: none;">
                                <button style="margin: auto; color: white; background-color: #0081CF; border-radius: 10px; border: 1px solid #0081CF; padding: 10px 20px; font-weight: bold;">Réinitialiser le mot de passe</button>
                            </a>
                            <p> Si vous n'avez pas demandé la réinitialisation de votre mot de passe cette demande, vous pouvez ignorer cet e-mail !</p>
                            <br>
                            <p>Cordialement,</p>
                            <p>L'équipe Viami</p>
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
            res.json({message: `Error sending email`});
        } else {
            res.status(200);
            res.json({message: `Email sent`});
        }
    }); 
}

// Verified user's email by token
exports.newPasswordForm = (req, res) => {
    const email = req.query.email;
    
    db("user")
        .select("*")
        .where("email", email)
        .then(user => {
            const htmlResponse = `
                <!DOCTYPE html>
                <html lang="fr">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Réinitialisation de mot de passe</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; text-align: center; width: 100%; background-color: white;">
                        <div style="width: 100%; max-width: 600px; margin: auto; background-color: #f1eee8; border: 1px solid #0081CF;">
                            <div style="background-color: #0081CF; text-align: center; padding: 10px; color: white;">
                                <h3>Réinitialisation de mot de passe</h3>
                            </div>
                            <form method="POST" action="${process.env.API_URL}/setNewPassword" style="padding: 10px;">
                                <input type="hidden" name="email"/>

                                <p>Nouveau mot de passe : 
                                    <input type="password" name="password"/>
                                </p>
                                <button type="submit" style="margin: auto; color: white; background-color: green; border-radius: 10px; border: 1px solid #0081CF; padding: 10px 20px; font-weight: bold;">Valider</button>
                            </form>
                        </div>
                    </body>
                </html>
            `;

            res.send(htmlResponse);
        })
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "User not found"});
        });
}