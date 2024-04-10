const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../knex");
const { uuid } = require('uuidv4');
let { AgeFromDateString } = require('age-calculator');
const nodemailer = require('nodemailer')
const fs = require('fs');
const path = require('path');

const currentModuleDir = __dirname;

// Register new user
exports.userRegister = (req, res) => {
    let newUser = req.body;
    
    if(newUser.password){

        bcrypt.hash(newUser.password, 10, (error, hash) => {
            if(error){
                res.status(401);
                
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
                            const userData = {
                                email: newUser.email, 
                                password: hash
                            }

                            jwt.sign(userData, process.env.JWT_KEY, {expiresIn: "1d"}, (error, tokenEmail) => {

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
                                        verifyEmailToken: tokenEmail,
                                        emailVerified: "0",
                                        fcmToken: newUser.fcmToken
                                    })
                                    .then(data => {
                                        exports.sendVerificationMail(newUser.email, tokenEmail);

                                        res.status(200).json({
                                            message: `User created : ${newUser.email}`,
                                            user: newUser
                                        })
                                    })
                                    .catch(error => {
                                        res.status(401);
                                    
                                        res.json({message: "Invalid request"});
                                    });
                            })
                        }
                    })
            }
        })
    }
    else{
        res.status(401);
        
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
                        const userData = {
                            id: user[0].id,
                            email: user[0].email,
                            password: user[0].password,
                        }

                        if(user[0].emailVerified === "0") {

                            jwt.sign(userData, process.env.JWT_KEY, {expiresIn: "1d"}, (error, token) => {     
                                db("user")
                                    .update("verifyEmailToken", token)
                                    .where("id", user[0].id)
                                    .then(data => {
                                        exports.sendVerificationMail(user[0].email, token);

                                        res.status(200);
                                        res.json({message: "Please verify your email !"});
                                    })
                                    .catch(error => {
                                        res.status(401);
                                      
                                        res.json({message: "User not found"});
                                    });
                            })

                        }
                        else {
                            jwt.sign(userData, process.env.JWT_KEY, (error, token) => {
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
                    }
                    else{
                        res.status(401);
                        res.json({message: "Incorrect password"})
                    }
                })
            }
            else{
                res.status(401);
               
                res.json({message: "Missing password", error: req.body});
            }
            
        })
        .catch((error) => {
            res.status(500);
       
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
       
        res.status(500).json({ message: 'Server error' });
      });
}

exports.checkToken = (req, res) => {
    let token = req.params.token;

    jwt.verify(token, process.env.JWT_KEY, function(error, decoded) {
        if (error) {
            error = {
              message: 'Token expired',
            }

            res.status(200).json({ message: error });
        }
        else {
            res.status(200).json({ message: "Token not expired" });
        }
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
                  
                  res.json({message: "User not found"});
              });    
       }
    });
}

// Update user's password by email
exports.updateUserPasswordByEmail = (req, res) => {
    const email = req.query.email;
    const password = req.body.password;
    
    db("user")
        .select("*")
        .where("email", email)
        .then((user) => {
            bcrypt.hash(password, 10, (error, hash) => {
                if(error){
                    res.status(401);
                    
                    res.json({message: "Impossible to encrypt the password"});
                }
                else{
                    db("user")
                        .update({password: hash})
                        .where("id", user[0].id)
                        .then(data => {
                            exports.passwordChangedSuccess(email);

                            const emailTemplatePath = path.join(currentModuleDir, '../email/passwordChanged.html');
                            const html = fs.readFileSync(emailTemplatePath, 'utf-8');

                            res.send(html);
                        })
                        .catch(error => {
                            res.status(401);
                           
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
            
            res.json({message: "User not found"});
        });
}

// delete user language, user image, user interest, user premium plan, user date location, 
// user comment, request message user, message user read, message, image,group
// forum posts city, forum comment, forum, comment
// Delete user by id
exports.deleteUserById =(req,res) => {
    const userId = req.params.userId;

    db("user")
    .delete("userId", userId)
    .where("id", id)      
    .then(() => {
        res.status(200).json({ message: ` The user with ID ${userId} has been deleted ` });
      })
      .catch((error) => {
      
        res.status(500).json({ message: 'Server error' });
      });
}

// Send email to user for email verification
exports.sendVerificationMail = async(to, token) =>{

    const emailTemplatePath = path.join(currentModuleDir, '../email/sendVerifyEmail.html');
    const htmlContent = fs.readFileSync(emailTemplatePath, 'utf-8');
    const html = htmlContent
        .replace('${process.env.CDN_URL}', process.env.CDN_URL)
        .replace('${process.env.API_URL_2}', process.env.API_URL_2)
        .replace('${token}', token);

    let mailOptions = ({
        from: process.env.VIAMI_EMAIL,
        to: to,
        subject: "Vérification de l'adresse e-mail Viami",
        html: html});

    const transporter = nodemailer.createTransport({
        host: process.env.VIAMI_HOST,
        port: process.env.VIAMI_PORT, 
        secure: true,
        auth: {
            user: process.env.VIAMI_EMAIL,
            pass: process.env.VIAMI_PASSWORD,
        },
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
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
    
    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
        if (err) {
            err = {
              name: 'TokenExpiredError',
              message: 'Token expired',
            }

            const emailTemplatePath = path.join(currentModuleDir, '../email/emailVerifyExpired.html');
            const htmlContent = fs.readFileSync(emailTemplatePath, 'utf-8');
        
            res.send(htmlContent);
        }
        else {
            const emailTemplatePath = path.join(currentModuleDir, '../email/emailVerified.html');
            const htmlContent = fs.readFileSync(emailTemplatePath, 'utf-8');

            db("user")
                .update("emailVerified", "1")
                .where("verifyEmailToken", token)
                .then(data => {
                    db("user")
                        .select("*")
                        .where("verifyEmailToken", token)
                        .then((user) => {
                            exports.sendEmailVerified(user[0].email);
                
                            res.send(htmlContent);
                        })
                        .catch((error) => {
                            res.status(401);
                            res.json({message: "User not found"});
                        })
                })
                .catch(error => {
                    res.status(401);
                  
                    res.json({message: "User not found"});
                });
        }
      });
   
}

// Send an email to user when email is verified successfully
exports.sendEmailVerified = async(to) =>{

    const emailTemplatePath = path.join(currentModuleDir, '../email/sendEmailVerified.html');
    const htmlContent = fs.readFileSync(emailTemplatePath, 'utf-8');
    const html = htmlContent
        .replace('${process.env.CDN_URL}', process.env.CDN_URL);

    let mailOptions = ({
        from: process.env.VIAMI_EMAIL,
        to: to,
        subject: "Bienvenue sur Viami !",
        html: html});
   
    const transporter = nodemailer.createTransport({
        host: process.env.VIAMI_HOST,
        port: process.env.VIAMI_PORT, 
        secure: true,
        auth: {
            user: process.env.VIAMI_EMAIL,
            pass: process.env.VIAMI_PASSWORD,
        },
    });
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          
            res.status(401);
            res.json({message: `Error sending email`});
        } else {
            res.status(200);
            res.json({message: `Email sent`});
        }
    }); 
}

// Send an email of change password to the demanded email
exports.forgetPassword = async(req, res) => {
    const to = req.body.email;

    jwt.sign({email: to}, process.env.JWT_KEY, {expiresIn: "1h"}, (error, token) => {

        const emailTemplatePath = path.join(currentModuleDir, '../email/forgetPassword.html');
        const htmlContent = fs.readFileSync(emailTemplatePath, 'utf-8');
        const html = htmlContent
            .replace('${process.env.CDN_URL}', process.env.CDN_URL)
            .replace('${process.env.API_URL_2}', process.env.API_URL_2)
            .replace('${token}', token)
            .replace('${to}', to);

        let mailOptions = ({
            from: process.env.VIAMI_EMAIL,
            to: to,
            subject: "Réinitialisation de votre mot de passe",
            html: html});
    
        const transporter = nodemailer.createTransport({
            host: process.env.VIAMI_HOST,
            port: process.env.VIAMI_PORT, 
            secure: true,
            auth: {
                user: process.env.VIAMI_EMAIL,
                pass: process.env.VIAMI_PASSWORD,
            },
        });
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                
                res.status(401);
                res.json({message: `Error sending email`});
            } else {
                res.status(200);
                res.json({message: `Email sent`});
            }
        }); 
    })
}

// Display the form to change password in html
exports.newPasswordForm = (req, res) => {
    const email = req.query.email;
    const token = req.query.token;

    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
        if (err) {
            err = {
              name: 'TokenExpiredError',
              message: 'Token expired',
            }

            const emailTemplatePath = path.join(currentModuleDir, '../email/emailVerifyExpired.html');
            const htmlContent = fs.readFileSync(emailTemplatePath, 'utf-8');
        
            res.send(htmlContent);
        }
        else {
            const emailTemplatePath = path.join(currentModuleDir, '../email/newPasswordForm.html');
            const htmlContent = fs.readFileSync(emailTemplatePath, 'utf-8');
            const html = htmlContent
                .replace('${process.env.API_URL_2}', process.env.API_URL_2)
                .replace('${email}', email);

            db("user")
                .select("*")
                .where("email", email)
                .then(user => {
                    res.send(html);
                })
                .catch(error => {
                    res.status(401);
                   
                    res.json({message: "User not found"});
                });
            }
        })
}

// Send email when password is changed successfully
exports.passwordChangedSuccess = (email) => {
    const to = email;

    const emailTemplatePath = path.join(currentModuleDir, '../email/passwordChangedSuccess.html');
    const htmlContent = fs.readFileSync(emailTemplatePath, 'utf-8');
    const html = htmlContent
        .replace('${process.env.CDN_URL}', process.env.CDN_URL);

    let mailOptions = ({
        from: process.env.VIAMI_EMAIL,
        to: to,
        subject: "Votre mot de passe a été changé avec succès",
        html: html});
   
    const transporter = nodemailer.createTransport({
        host: process.env.VIAMI_HOST,
        port: process.env.VIAMI_PORT, 
        secure: true,
        auth: {
            user: process.env.VIAMI_EMAIL,
            pass: process.env.VIAMI_PASSWORD,
        },
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            
            res.status(401);
            res.json({message: `Error sending email`});
        } else {
            res.status(200);
            res.json({message: `Email sent`});
        }
    }); 
}

// Get the status of a user
exports.getUserStatus = (req, res) => {
    const userId = req.params.userId;
  
    db('user')
      .select('connected', 'lastConnection')
      .where('id', userId)
      .then(user => {
        if (user.length > 0) {
          const userStatus = user[0].connected === '1'
            ? { status: 'online', lastConnection: null }
            : { status: 'offline', lastConnection: user[0].lastConnection };
          res.status(200).json({ userStatus: userStatus });
        } else {
          res.status(200).json({ userStatus: { status: 'unknown', lastConnection: null } });
        }
      })
      .catch(error => {
        
        res.status(500).json({ message: 'Internal server error' });
      });
  };


// Update the fcm token of a user
exports.setFcmTokenUser = (req, res) => {
  let fcmToken = req.query.fcmToken;
  let userId = req.params.userId;

  db("user")
    .update({"fcmToken": fcmToken})
    .where("id", userId)
    .then((response) => {
      res.status(200).json({
          message: "Successfully updating the fcm token of a user"
      });
    })
    .catch((error) => {
      res.status(400).json({
          message: "Failed updating the fcm token of a user"
      });
    
    
    });
}

// Search for users by first name
exports.searchUsersByFirstName = (req, res) => {
    const searchTerm = req.params.search; 

    db('user')
        .select('*')
        .where('firstName', searchTerm) 
        .then(data => res.status(200).json({ data }))
        .catch(error => {
           
            res.status(500).json({ message: 'Internal server error' });
        });
};

// Update user's plan
exports.updateUserPlan = (req, res) => {
    const userId = req.params.userId;
    const plan = req.body.plan;

    db("user")
        .update("plan", plan)
        .where({"id": userId})
        .then(() => {
            res.status(201);
            res.json({message: "User's plan is updated successfully"});
        })
        .catch((error) => {
            
            res.status(401);
            res.json({message: "Server error"});
        })

}

// Function to get users with whom a specific user has had a conversation
exports.getUsersWithConversation = (req, res) => {
    const userId = req.params.userId;

    db("user_group")
        .select("groupId")
        .where("userId", userId)
        .then(groups => {
            const groupIds = groups.map(group => group.groupId);

            
            db("user_group")
                .select("userId")
                .whereIn("groupId", groupIds)
                .andWhere("userId", "<>", userId)
                .distinct("userId")
                .then(userIds => {
                    const userIdsArray = userIds.map(user => user.userId);

                   
                    db("user")
                        .select("*")
                        .whereIn("id", userIdsArray)
                        .then(data => res.status(200).json({data}))
                        .catch(error => {
                           
                            res.status(500).json({ message: "Server error" });
                        });
                })
                .catch(error => {
                    
                    res.status(500).json({ message: "Server error" });
                });
        })
        .catch(error => {
            
            res.status(500).json({ message: "Server error" });
        });
}
