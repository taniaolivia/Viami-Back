const db = require("../knex");
const activityCommentService = require('../services/activityCommentService');

 // Route to check if a user has left a comment for another user
 exports.hasUserLeftComment = async (req, res) => {
  const activityId = req.params.activityId;
  const otherUserId = req.params.otherUserId;

  try {
      const hasLeftComment = await activityCommentService.hasUserLeftComment(activityId, otherUserId);
      const userStatus = hasLeftComment
          ? { hasUserLeftComment: true }
          : { hasUserLeftComment: false };

      res.status(200).json(userStatus);
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
};


  // Function to add a comment to a traveler's profile
  exports.addCommentToActivity = async (req, res) => {
    const activityId = req.params.activityId; 
    const commenterId = req.body.commenterId; 
    const commentText = req.body.commentText; 

    try {
        await activityCommentService.addCommentToActivity(activityId, commenterId, commentText);
        res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
