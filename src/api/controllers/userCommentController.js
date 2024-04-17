const db = require("../knex");
const userCommentService = require("../services/userCommentService");

// Get all comments with their users
exports.getAllUsersComments = async (req, res) => {
  try {
      const data = await userCommentService.getAllUsersComments();
      res.status(200).json({ data });
  } catch (error) {
      res.status(401).json({ message: "Server error" });
  }
};

// Get all comments of a user by id
exports.getUserCommentsById = async (req, res) => {
  try {
      const userId = req.params.userId;
      const data = await userCommentService.getUserCommentsById(userId);
      res.status(200).json({ "userComments": data });
  } catch (error) {
      res.status(401).json({ message: "Server error" });
  }
};

// Function to add a comment to a traveler's profile
exports.addCommentToUserProfile = async (req, res) => {
    const { commenterId, commentText } = req.body;
    const userId = req.params.userId;

    try {
        const response = await userCommentService.addCommentToUserProfile(userId, commenterId, commentText);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Function to check if the user has left a comment for the other user
exports.hasUserLeftComment = async (req, res) => {
  const userId = req.params.userId;
  const otherUserId = req.params.otherUserId;

  try {
    const response = await userCommentService.hasUserLeftComment(userId, otherUserId);
    res.status(200).json(response);
} catch (error) {
    res.status(500).json({ message: error.message });
}
};
