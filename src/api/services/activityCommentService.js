const db = require("../knex");

exports.hasUserLeftComment = (activityId, otherUserId) => {
    return new Promise((resolve, reject) => {
        db('activity_comment')
            .where({
                activityId: activityId,
                commenterId: otherUserId
            })
            .count('* as count')
            .then(results => {
                const hasLeftComment = results[0].count > 0;
                resolve(hasLeftComment);
            })
            .catch(error => {
                reject(error);
            });
    });
};

exports.addCommentToActivity = (activityId, commenterId, commentText) => {
    return new Promise((resolve, reject) => {
        db.transaction(trx => {
            trx('comment')
                .insert({ comment: commentText })
                .returning('id')
                .then(commentId => {
                    return trx('activity_comment')
                        .insert({
                            activityId: activityId,
                            commenterId: commenterId,
                            commentId: commentId[0],
                        });
                })
                .then(trx.commit)
                .catch(trx.rollback);
        })
        .then(() => {
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
};
