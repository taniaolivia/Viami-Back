const db = require("../knex");

exports.listAllComments = () => {
    return db("comment").select("*");
};

exports.getCommentById = (commentId) => {
    return db("comment").select("*").where({ id: commentId }).first();
};


