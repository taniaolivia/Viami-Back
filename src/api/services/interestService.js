const db = require("../knex");

exports.getAllInterests = () => {
    return db("interest")
        .select("*");
};

exports.getInterestById = async (interestId) => {
    try {
        const interest = await db('interest').select('*').where({ id: interestId }).first();
        return interest;
    } catch (error) {
        throw new Error('Database error');
    }
};