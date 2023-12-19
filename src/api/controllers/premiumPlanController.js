const db = require("../knex");

// Get all details of all premium plans
exports.getAllPremiumPlans = (req, res) => {

    db("premium_plan")
        .select("*")
        .then((response) => {
            res.status(200);
            res.json({plans: response});
        })
        .catch((error) => {
            console.log(error);
            res.status(401);
            res.json({message: "Server error"});
        })
}

// Get all details of a premium plan by id
exports.getPremiumPlanById = (req, res) => {
    const planId = req.params.planId;

    db("premium_plan")
        .select("*")
        .where("id", planId)
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