const db = require("../knex");

exports.getAllUsersComments = async () => {
    try {
        const comments = await db("user_comment")
            .select("*")
            .join("user", "user.id", "=", "user_comment.userId")
            .join("comment", "comment.id", "=", "user_comment.commentId");
        
        return comments;
    } catch (error) {
        throw new Error("Failed to get all users comments");
    }
};

exports.getUserCommentsById = async (userId) => {
    try {
        const userComments = await db("user_comment")
            .select("*")
            .where({ userId:userId })
            .join("user", "user.id", "=", "user_comment.userId")
            .join("comment", "comment.id", "=", "user_comment.commentId");

        return userComments;
    } catch (error) {
        throw new Error("Failed to get user comments by id");
    }
};

exports.addCommentToUserProfile = async (userId, commenterId, commentText) => {
    try {
        const commentIds = await db("comment").insert({ comment: commentText });
        const commentId = commentIds[0];

        await db("user_comment").insert({
            userId: userId,
            commenterId: commenterId,
            commentId: commentId,
        });

        return { message: 'Comment added successfully' };
    } catch (error) {
        throw new Error('Internal server error');
    }
};


exports.hasUserLeftComment = async (userId, otherUserId) => {
    try {
        const result = await db("user_comment")
            .count("* as count")
            .where({ userId: userId, commenterId: otherUserId })
            .first();

        return { hasUserLeftComment: result.count > 0 };
    } catch (error) {
        throw new Error("Internal server error");
    }
};
