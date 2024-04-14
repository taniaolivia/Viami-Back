const db = require("../knex");
const premiumPlanService = require('../services/premiumPlanService');

exports.getAllPremiumPlans = async (req, res) => {
    try {
        const response = await premiumPlanService.getAllPremiumPlans();
        res.status(200).json({ plans: response });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Get all details of a premium plan by id
exports.getPremiumPlanById = async (req, res) => {
    try {
        const planId = req.params.planId;
        const response = await premiumPlanService.getPremiumPlanById(planId);
        if (!response) {
            return res.status(404).json({ message: 'Premium plan not found' });
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};