const db = require("../knex");

// Get all comments with their users
exports.getAllUsersComments = (req, res) => {
    db("user_comment")
        .select("*")
        .join("user", "user.id", "=", "user_comment.userId")
        .join("comment", "comment.id", "=", "user_comment.commentId")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get all comments of a user by id
exports.getUserCommentsById = (req, res) => {
    let id = req.params.userId;

    db("user_comment")
        .select("*")
        .where({userId: id})
        .join("user", "user.id", "=", "user_comment.userId")
        .join("comment", "comment.id", "=", "user_comment.commentId")
        .then(data => res.status(200).json({"userComments": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Function to add a comment to a traveler's profile
exports.addCommentToUserProfile = (req, res) => {
    const userId = req.params.userId; 
    const commenterId = req.body.commenterId; 
    const commentText = req.body.commentText; 
  
   
    db('comment')
      .insert({ comment: commentText })
      .then(commentIds => {
        const commentId = commentIds[0];
  
        db('user_comment')
          .insert({
            userId: userId,
            commenterId: commenterId,
            commentId: commentId,
          })
          .then(() => {
            res.status(200).json({ message: 'Comment added successfully' });
          })
          .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      });
  };


 // Route to check if a user has left a comment for another user
exports.hasUserLeftComment = (req, res) => {
  const userId = req.params.userId;
  const otherUserId = req.params.otherUserId;

  

  // Function to check if the user has left a comment for the other user
  const checkComment = (userId, otherUserId) => {
    return new Promise((resolve, reject) => {
      db('user_comment')
        .count('* as count')
        .where({
          userId: otherUserId,
          commenterId: userId
        })
        .then(results => {
          const hasLeftComment = results[0].count > 0;
          resolve(hasLeftComment);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // Usage of the function
  checkComment(userId, otherUserId)
    .then(hasLeftComment => {
      const userStatus = hasLeftComment
        ? { hasUserLeftComment: true }
        : { hasUserLeftComment: false };

      res.status(200).json(userStatus);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
};
