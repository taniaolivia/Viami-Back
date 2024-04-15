const  commentService = require('../services/commentService');

// Get a list of comments
exports.listAllComments = async (req, res) => {
    try {
        const data = await commentService.listAllComments();
        res.status(200).json({ "comments": data });
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};

// Get a comment by id
exports.getCommentById = async (req, res) => {
    const commentId = req.params.commentId;
    try {
        const data = await commentService.getCommentById(commentId);
        if (data) {
            res.status(200).json({ data });
            return; 
        }
    } catch (error) {
        res.status(401).json({ message: "Server error" });
        return;
    }
    
    res.status(401).json({ message: "Comment not found" });
};