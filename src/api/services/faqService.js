const db = require("../knex");

exports.getAllFaq = () => {
    return db("faq")
        .select("*")
        .orderBy("question", "asc");
};

exports.getTopFiveFrequentedFaq = async () => {
    try {
        const data = await db("faq")
            .select("*")
            .where("isFrequented", 1)
            .orderBy("question", "asc")
            .limit(5)
            .offset(0);
        return data;
    } catch (error) {
        throw new Error("Database error");
    }
};

exports.getFaqById = async (id) => {
    try {
        const faq = await db("faq").select("*").where("id", id).first();
        return faq;
    } catch (error) {
        throw new Error("Failed to fetch FAQ");
    }
};
