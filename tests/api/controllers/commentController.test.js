const commentController = require('../../../src/api/controllers/commentController');
const commentService = require('../../../src/api/services/commentService');

jest.mock('../../../src/api/services/commentService');

describe('listAllComments Controller', () => {
    it('should return a list of comments', async () => {
        const mockComments = [
            { id: 1, text: 'Comment 1' },
            { id: 2, text: 'Comment 2' },
            { id: 3, text: 'Comment 3' }
        ];

        commentService.listAllComments.mockResolvedValueOnce(mockComments);

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await commentController.listAllComments(req, res);

        expect(commentService.listAllComments).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ comments: mockComments });
    });

    it('should return server error when database operation fails', async () => {
        commentService.listAllComments.mockRejectedValueOnce(new Error('Database error'));

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await commentController.listAllComments(req, res);

 
        expect(commentService.listAllComments).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});



describe('getCommentById Controller', () => {
    it('should return comment when found', async () => {
        const mockCommentId = 1;
        const mockComment = { id: 1, text: 'Sample comment' };

        commentService.getCommentById.mockResolvedValueOnce(mockComment);

        const req = { params: { commentId: mockCommentId } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await commentController.getCommentById(req, res);

        expect(res.status).toHaveBeenCalledWith(200); 
        expect(res.json).toHaveBeenCalledWith({ data: mockComment });
    });

    it('should return "Comment not found" when comment is not found', async () => {
        const mockCommentId = 1;

        commentService.getCommentById.mockResolvedValueOnce(null);

        const req = { params: { commentId: mockCommentId } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await commentController.getCommentById(req, res);

        expect(res.status).toHaveBeenCalledWith(401); // Attendez-vous à un statut 404
        expect(res.json).toHaveBeenCalledWith({ message: "Comment not found" });
    });

    it('should return "Server error" when an error occurs', async () => {
        const mockCommentId = 1;

        commentService.getCommentById.mockRejectedValueOnce(new Error('Database error'));

        const req = { params: { commentId: mockCommentId } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await commentController.getCommentById(req, res);

        expect(res.status).toHaveBeenCalledWith(401); 
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});
