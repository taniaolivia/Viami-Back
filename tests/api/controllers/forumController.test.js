const forumController = require('../../../src/api/controllers/forumController');
const forumService = require('../../../src/api/services/forumService');

jest.mock('../../../src/api/services/forumService');

describe('Forum Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getListCitiesForum', () => {
        it('should return list of cities for forum', async () => {
            const mockCities = [
                { id: 1, city: 'City 1', image: 'image1.jpg' },
                { id: 2, city: 'City 2', image: 'image2.jpg' }
            ];
            forumService.getListCitiesForum.mockResolvedValue(mockCities);
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumController.getListCitiesForum(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ "forum_cities": mockCities });
        });

        it('should handle error if failed to get list of cities for forum', async () => {
            forumService.getListCitiesForum.mockRejectedValue(new Error('Failed to get list of cities'));
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumController.getListCitiesForum(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });

    
    // Write tests for
    // addCommentToPostById, 

    describe('addPostByCity', () => {
        it('should add a post to the specified city', async () => {
            const cityId = 1;
            const userId = 1;
            const post = 'New post';
    
            forumService.addPostByCity.mockResolvedValue();
    
            const req = { params: { cityId }, body: { userId, post } };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.addPostByCity(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Post added successfully" });
        });
    
        it('should handle error if failed to add post to city', async () => {
            const cityId = 1;
            const userId = 1;
            const post = 'New post';
    
            const errorMessage = 'Failed to add post to city';
            forumService.addPostByCity.mockRejectedValue(new Error(errorMessage));
    
            const req = { params: { cityId }, body: { userId, post } };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.addPostByCity(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });    

    describe('getAllPostsByCity', () => {
        it('should return all posts for a specific city with details', async () => {
            const cityId = 1;
            const mockPosts = [
                { 
                    id: 1, 
                    post: 'Post 1', 
                    user: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', profileImage: 'image1.jpg' }, 
                    city: { id: 1, city: 'City 1', image: 'city1.jpg' }, 
                    postedOn: '2024-04-15' 
                },
                { 
                    id: 2, 
                    post: 'Post 2', 
                    user: { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', profileImage: 'image2.jpg' }, 
                    city: { id: 1, city: 'City 1', image: 'city1.jpg' }, 
                    postedOn: '2024-04-14' 
                }
            ];
    
            forumService.getAllPostsByCity.mockResolvedValue(mockPosts);
    
            const req = { params: { cityId } };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.getAllPostsByCity(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ "forum_posts_cities": mockPosts });
        });
    
        it('should handle error if failed to get posts for city', async () => {
            const cityId = 1;
    
            const errorMessage = 'Failed to get posts by city';
            forumService.getAllPostsByCity.mockRejectedValue(new Error(errorMessage));
    
            const req = { params: { cityId } };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.getAllPostsByCity(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });    

    describe('getAllPosts', () => {
        it('should return all posts with details', async () => {
            const mockPosts = [
                { id: 1, post: 'Post 1', user: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', profileImage: 'image1.jpg' }, postedOn: '2024-04-15' },
                { id: 2, post: 'Post 2', user: { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', profileImage: 'image2.jpg' }, postedOn: '2024-04-14' }
            ];
    
            forumService.getAllPosts.mockResolvedValue(mockPosts);
    
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.getAllPosts(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ "forum": mockPosts });
        });
    
        it('should handle error if failed to get all posts', async () => {
            const errorMessage = 'Failed to get all posts';
            forumService.getAllPosts.mockRejectedValue(new Error(errorMessage));
    
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.getAllPosts(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });

    describe('addPost', () => {
        it('should add a post successfully', async () => {
            const userId = 1;
            const post = 'New post';
    
            forumService.addPost.mockResolvedValue();
    
            const req = { body: { userId, post } };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.addPost(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Post added successfully" });
        });
    
        it('should handle error if failed to add post', async () => {
            const userId = 1;
            const post = 'New post';
    
            const errorMessage = 'Failed to add post';
            forumService.addPost.mockRejectedValue(new Error(errorMessage));
    
            const req = { body: { userId, post } };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.addPost(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });
    
    describe('getCommentsPostById', () => {
        it('should return comments for a specific post', async () => {
            const postId = 1;
    
            const mockComments = [
                { id: 1, forumId: postId, comment: 'Comment 1', user: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', profileImage: 'image1.jpg' }, commentedOn: '2024-04-15' },
                { id: 2, forumId: postId, comment: 'Comment 2', user: { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', profileImage: 'image2.jpg' }, commentedOn: '2024-04-14' }
            ];
    
            forumService.getCommentsPostById.mockResolvedValue(mockComments);
    
            const req = { params: { postId } };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.getCommentsPostById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ "forum_comment": mockComments });
        });
    
        it('should handle error if failed to get comments for post', async () => {
            const postId = 1;
    
            const errorMessage = 'Failed to get comments for post';
            forumService.getCommentsPostById.mockRejectedValue(new Error(errorMessage));
    
            const req = { params: { postId } };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.getCommentsPostById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });
    
    describe('addCommentToPostById', () => {
        it('should add a comment to the post successfully', async () => {
            const postId = 1;
            const userId = 1;
            const comment = 'New comment';
    
            forumService.addCommentToPostById.mockResolvedValue();
    
            const req = { params: { postId }, body: { userId, comment } };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.addCommentToPostById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Comment added successfully" });
        });
    
        it('should handle error if failed to add comment to post', async () => {
            const postId = 1;
            const userId = 1;
            const comment = 'New comment';
    
            const errorMessage = 'Failed to add comment to post';
            forumService.addCommentToPostById.mockRejectedValue(new Error(errorMessage));
    
            const req = { params: { postId }, body: { userId, comment } };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await forumController.addCommentToPostById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });

    describe('getAllNewestPosts', () => {
        it('should return list of newest posts in forum', async () => {
            const mockPosts = [
                { id: 1, post: 'Post 1', user: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', profileImage: 'image1.jpg' }, postedOn: '2024-04-15' },
                { id: 2, post: 'Post 2', user: { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', profileImage: 'image2.jpg' }, postedOn: '2024-04-14' }
            ];

            forumService.getAllNewestPosts.mockResolvedValue(mockPosts);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumController.getAllNewestPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ "forum": mockPosts });
        });

        it('should handle error if failed to get list of newest posts', async () => {
            forumService.getAllNewestPosts.mockRejectedValue(new Error('Failed to get newest posts'));

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumController.getAllNewestPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });

    describe('getAllOldestPosts', () => {
        it('should return list of oldest posts in forum', async () => {
            const mockPosts = [
                { id: 1, post: 'Post 1', user: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', profileImage: 'image1.jpg' }, postedOn: '2024-04-15' },
                { id: 2, post: 'Post 2', user: { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', profileImage: 'image2.jpg' }, postedOn: '2024-04-14' }
            ];
            forumService.getAllOldestPosts.mockResolvedValue(mockPosts);
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumController.getAllOldestPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ "forum": mockPosts });
        });

        it('should handle error if failed to get list of oldest posts', async () => {
            forumService.getAllOldestPosts.mockRejectedValue(new Error('Failed to get oldest posts'));
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumController.getAllOldestPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });
});
