const db = require("../knex");
const jwt = require("jsonwebtoken");

exports.getUserLastPremiumPlan = async (userId) => {
    try {
        return await db("user_premium_plan")
            .select("*")
            .where({ userId: userId })
            .orderBy("id", "desc")
            .limit(1);
    } catch (error) {
        throw new Error("Server error");
    }
};


exports.addUserPremiumPlan = async (userId, planId) => {
    try {
        const token = await generateToken(userId);
        await db("user_premium_plan").insert({
            userId: userId,
            planId: planId,
            token: token
        });
        await db("user").update("plan", "premium").where({ id: userId });
        return { message: "Premium plan added successfully" };
    } catch (error) {
        console.log(error)
        throw new Error("Server error");
    }
};




const generateToken = (userId) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ id: userId }, process.env.JWT_KEY, { expiresIn: "7d" }, (error, token) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });
    });
};
