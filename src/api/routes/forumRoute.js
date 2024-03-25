module.exports = (server) => {
    const forumController = require("../controllers/forumController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
/**
 * @openapi
 * paths:
 *   /api/forum/posts:
 *     get:
 *       tags:
 *         - Posts
 *       summary: "List all posts in forum general"
 *       description: "Get a list of all posts in forum general."
 *       
 *       responses:
 *         '200':
 *           description: "Posts in forum retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 forum:
 *                   - id: 1
 *                     post: "Post 1"
 *                     user:
 *                       id: "1"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                     postedOn: 2023-12-23
 *                   - id: 2
 *                     post: "Post 2"
 *                     user:
 *                       id: "2"
 *                       firstName: "John"
 *                       lastName: "Dawson"
 *                       email: "example@email.com"
 *                     postedOn: 2023-12-24
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comments retrieval."
 * 
 * 
 *     post:
 *       tags:
 *         - Post
 *       summary: "Add a post in forum general"
 *       description: "Add a post in forum general."
 *       requestBody:
 *         description: "Post's details"
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               userId: "1"
 *               post: "Post text here"
 *      
 *       responses:
 *         '200':
 *           description: "Post added successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Post added successfully"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comment addition."
 * 
 */
server.route("/api/forum/posts")
.get(jwtMiddleware.authenticateUser, cors(), forumController.getAllPosts)
.post(jwtMiddleware.authenticateUser, cors(), forumController.addPost);

/**
 * @openapi
 * paths:
 *   /api/forum/cities:
 *     get:
 *       tags:
 *         - Cities
 *       summary: "List all cities available in forum"
 *       description: "Get a list of all cities available in forum."
 *       
 *       responses:
 *         '200':
 *           description: "Cities available in forum retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 forum:
 *                   - id: 1
 *                     city: "Paris"
 *                   - id: 2
 *                     city: "Barcelone"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comments retrieval."
 */
server.route("/api/forum/cities")
.get(jwtMiddleware.authenticateUser, cors(), forumController.getListCitiesForum);

/**
 * @openapi
 * paths:
 *   /api/forum/posts_cities/{cityId}:
 *     get:
 *       tags:
 *         - Posts City
 *       summary: "List all posts of a city in forum"
 *       description: "Get a list of all posts of a city in forum."
 *       
 *       parameters:
 *         - in: path
 *           name: cityId
 *           required: true
 *           description: ID of the city to retrieve.
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "Posts of a city in forum retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 forum:
 *                   - id: 1
 *                     post: "Post 1"
 *                     cityId: 1
 *                     user:
 *                       id: "1"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                     postedOn: 2023-02-11
 *                   - id: 2
 *                     post: "Post 2"
 *                     cityId: 2
 *                     user:
 *                       id: "2"
 *                       firstName: "John"
 *                       lastName: "Dawson"
 *                       email: "example@email.com"
 *                     postedOn: 2023-02-11
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comments retrieval."
 * 
 * 
 *     post:
 *       tags:
 *         - Post by city
 *       summary: "Add a post in forum by city"
 *       description: "Add a post in forum by city."
 *       requestBody:
 *         description: "Post's details"
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               userId: "1"
 *               cityId: "1"
 *               post: "Post text here"
 *      
 *       responses:
 *         '200':
 *           description: "Post added successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Post added successfully"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comment addition."
 * 
 */
server.route("/api/forum/posts_cities/:cityId")
.get(jwtMiddleware.authenticateUser, cors(), forumController.getAllPostsByCity)
.post(jwtMiddleware.authenticateUser, cors(), forumController.addPostByCity);

/**
 * @openapi
 * paths:
 *   /api/forum/posts/{postId}/comments:
 *     get:
 *       tags:
 *         - Post's comments
 *       summary: "List all comments of a post in forum"
 *       description: "Get a list of all comments of a post in forum."
 *       
 *       parameters:
 *         - in: path
 *           name: postId
 *           required: true
 *           description: ID of the post to retrieve.
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "Comments of a post in forum retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 forum:
 *                   - id: 1
 *                     forumId: 1
 *                     comment: "Comment 1"
 *                     user:
 *                       id: "1"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                     commentedOn: 2023-02-11
 *                   - id: 2
 *                     forumId: 1
 *                     comment: "Comment 1"
 *                     user:
 *                       id: "2"
 *                       firstName: "John"
 *                       lastName: "Dawson"
 *                       email: "example@email.com"
 *                     commentedOn: 2023-02-11
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comments retrieval."
 * 
 * 
 *     post:
 *       tags:
 *         - Comment of a post
 *       summary: "Add a comment to a post in forum"
 *       description: "Add a comment to a post in forum."
 *       requestBody:
 *         description: "Comment's of a post details"
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               userId: "1"
 *               cityId: "1"
 *               comment: "Comment text here"
 *      
 *       responses:
 *         '200':
 *           description: "Comment added successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Comment added successfully"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comment addition."
 * 
 */
server.route("/api/forum/posts/:postId/comments")
.get(jwtMiddleware.authenticateUser, cors(), forumController.getCommentsPostById)
.post(jwtMiddleware.authenticateUser, cors(), forumController.addCommentToPostById);

/**
 * @openapi
 * paths:
 *   /api/forum/posts/newest:
 *     get:
 *       tags:
 *         - Posts
 *       summary: "List all newest posts in forum general"
 *       description: "Get a list of all newest posts in forum general."
 *       
 *       responses:
 *         '200':
 *           description: "Newest posts in forum retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 forum:
 *                   - id: 2
 *                     post: "Post 2"
 *                     user:
 *                       id: "2"
 *                       firstName: "John"
 *                       lastName: "Dawson"
 *                       email: "example@email.com"
 *                     postedOn: 2023-12-24
 *                   - id: 1
 *                     post: "Post 1"
 *                     user:
 *                       id: "1"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                     postedOn: 2023-12-23
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comments retrieval."
 */
server.route("/api/forum/posts/newest")
.get(jwtMiddleware.authenticateUser, cors(), forumController.getAllNewestPosts);

/**
 * @openapi
 * paths:
 *   /api/forum/posts/oldest:
 *     get:
 *       tags:
 *         - Posts
 *       summary: "List all oldest posts in forum general"
 *       description: "Get a list of all oldest posts in forum general."
 *       
 *       responses:
 *         '200':
 *           description: "Oldest posts in forum retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 forum:
 *                   - id: 1
 *                     post: "Post 1"
 *                     user:
 *                       id: "1"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                     postedOn: 2023-12-23
 *                   - id: 2
 *                     post: "Post 2"
 *                     user:
 *                       id: "2"
 *                       firstName: "John"
 *                       lastName: "Dawson"
 *                       email: "example@email.com"
 *                     postedOn: 2023-12-24
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comments retrieval."
 */
server.route("/api/forum/posts/oldest")
.get(jwtMiddleware.authenticateUser, cors(), forumController.getAllOldestPosts);

}