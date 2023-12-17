const db = require("../knex");
const jwt = require("jsonwebtoken");

// Get the latest user's plan
exports.getUserLastPremiumPlan = (req, res) => {
    const userId = req.params.userId;

    db("user_premium_plan")
        .select("*")
        .where({"userId": userId})
        .orderBy("id", "desc")
        .limit(1)
        .then((response) => {
            res.status(200);
            res.json(response);
        })
        .catch((error) => {
            console.log(error);
            res.status(401);
            res.json({message: "Server error"});
        })
}

// Add a new premium plan to user's data
exports.addUserPremiumPlan = (req, res) => {
    let userId = req.params.userId;
    let planId = req.body.planId;
    let expirationOneWeek = "7d";
    let expirationOneMonth = "30d";
    let expire;

    jwt.sign({id: userId}, process.env.JWT_KEY, {expiresIn: "7d"}, (error, token) => {
        if(error){
            console.log(error);
            res.status(500);
            res.json({message: "Impossible to generate a token"});
        }
        else{
            db("user_premium_plan")
                .insert({
                    userId: userId,
                    planId: planId,
                    token: token
                })
                .then((response) => {
                    db("user")
                        .update("plan", "premium")
                        .where({"id": userId})
                        .then(() => {
                            res.status(201);
                            res.json(response);
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(401);
                            res.json({message: "Server error"});
                        })
                })
                .catch((error) => {
                    console.log(error);
                    res.status(401);
                    res.json({message: "Server error"});
                })
        }
    }) 
}