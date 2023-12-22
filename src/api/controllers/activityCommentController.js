const db = require("../knex");

 // Route to check if a user has left a comment for another user
 exports.hasUserLeftComment = (req, res) => {
    const activityId = req.params.activityId;
    const otherUserId = req.params.otherUserId;
  
    // Function to check if the user has left a comment for the other user
    const checkComment = (activityId, otherUserId) => {
      return new Promise((resolve, reject) => {
        db('activity_comment')
          .count('* as count')
          .where({
            activityId:activityId ,
            commenterId: otherUserId
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
    checkComment(activityId, otherUserId)
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


  // Function to add a comment to a traveler's profile
exports.addCommentToActivity = (req, res) => {
    const activityId = req.params.activityId; 
    const commenterId = req.body.commenterId; 
    const commentText = req.body.commentText; 
  
   
    db('comment')
      .insert({ comment: commentText })
      .then(commentIds => {
        const commentId = commentIds[0];
  
        db('activity_comment')
          .insert({
            activityId: activityId,
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