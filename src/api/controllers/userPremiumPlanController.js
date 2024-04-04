const db = require("../knex");
const jwt = require("jsonwebtoken");
const userPremiumPlanService = require('../services/userPremiumPlanService');

// Get the latest user's plan
exports.getUserLastPremiumPlan = async (req, res) => {
    const userId = req.params.userId;

    try {
        const response = await userPremiumPlanService.getUserLastPremiumPlan(userId);
        res.status(200).json(response);
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};


exports.addUserPremiumPlan = async (req, res) => {
    const userId = req.params.userId;
    const planId = req.body.planId;

    try {
        const response = await userPremiumPlanService.addUserPremiumPlan(userId, planId);
        res.status(201).json(response);
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};