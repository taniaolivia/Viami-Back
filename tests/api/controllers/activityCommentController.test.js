const activityCommentController = require('../../../src/api/controllers/activityCommentController');
const activityCommentService = require('../../../src/api/services/activityCommentService');

describe('hasUserLeftComment Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 with correct user status when user has left a comment', async () => {
        const req = { params: { activityId: 1, otherUserId: 2 } };

        activityCommentService.hasUserLeftComment = jest.fn().mockResolvedValue(true);

        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await activityCommentController.hasUserLeftComment(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        
        expect(res.json).toHaveBeenCalledWith({ hasUserLeftComment: true });
    });

    it('should return 200 with correct user status when user has not left a comment', async () => {
        const req = { params: { activityId: 1, otherUserId: 2 } };

        activityCommentService.hasUserLeftComment = jest.fn().mockResolvedValue(false);

        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await activityCommentController.hasUserLeftComment(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        
        expect(res.json).toHaveBeenCalledWith({ hasUserLeftComment: false });
    });
});


describe('addCommentToActivity Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    it('should return 200 when comment is added successfully', async () => {
        const req = { 
            params: { activityId: 1 }, 
            body: { commenterId: 2, commentText: 'This is a test comment' } 
        };

        activityCommentService.addCommentToActivity = jest.fn().mockResolvedValue();

        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await activityCommentController.addCommentToActivity(req, res);

        expect(activityCommentService.addCommentToActivity).toHaveBeenCalledWith(
            req.params.activityId, 
            req.body.commenterId, 
            req.body.commentText
        );

        expect(res.status).toHaveBeenCalledWith(200);
        
        expect(res.json).toHaveBeenCalledWith({ message: 'Comment added successfully' });
    });

    it('should return 500 when comment addition fails', async () => {
        const req = { 
            params: { activityId: 1 }, 
            body: { commenterId: 2, commentText: 'This is a test comment' } 
        };

        activityCommentService.addCommentToActivity = jest.fn().mockRejectedValue(new Error('Database error'));

        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await activityCommentController.addCommentToActivity(req, res);

        expect(activityCommentService.addCommentToActivity).toHaveBeenCalledWith(
            req.params.activityId, 
            req.body.commenterId, 
            req.body.commentText
        );

        expect(res.status).toHaveBeenCalledWith(500);
        
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});
