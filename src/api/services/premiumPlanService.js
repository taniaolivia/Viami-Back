const db = require("../knex");

exports.getAllPremiumPlans = async () => {
    try {
        const plans = await db("premium_plan").select("*");
        return plans;
    } catch (error) {
        throw new Error('Server error');
    }
};

exports.getPremiumPlanById = async (planId) => {
    try {
        const plan = await db("premium_plan").select("*").where("id", planId);
        return plan;
    } catch (error) {
        throw new Error('Database error');
    }
};