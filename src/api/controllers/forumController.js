const db = require("../knex");

const forumService = require('../services/forumService');

exports.getListCitiesForum = async (req, res) => {
    try {
        const cities = await forumService.getListCitiesForum();
        res.status(200).json({ "forum_cities": cities });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllPostsByCity = async (req, res) => {
    try {
        const cityId = req.params.cityId;
        const posts = await forumService.getAllPostsByCity(cityId);
        res.status(200).json({ "forum_posts_cities": posts });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.addPostByCity = async (req, res) => {
    try {
        const cityId = req.params.cityId;
        const userId = req.body.userId;
        const post = req.body.post;
        await forumService.addPostByCity(cityId, userId, post);
        res.status(200).json({ message: "Post added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await forumService.getAllPosts();
        res.status(200).json({ "forum": posts });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.addPost = async (req, res) => {
    try {
        const userId = req.body.userId;
        const post = req.body.post;
        await forumService.addPost(userId, post);
        res.status(200).json({ message: "Post added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getCommentsPostById = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await forumService.getCommentsPostById(postId);
        res.status(200).json({ "forum_comment": comments });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.addCommentToPostById = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;
        const comment = req.body.comment;
        await forumService.addCommentToPostById(postId, userId, comment);
        res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllNewestPosts = async (req, res) => {
    try {
        const posts = await forumService.getAllNewestPosts();
        res.status(200).json({ "forum": posts });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllOldestPosts = async (req, res) => {
    try {
        const posts = await forumService.getAllOldestPosts();
        res.status(200).json({ "forum": posts });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
