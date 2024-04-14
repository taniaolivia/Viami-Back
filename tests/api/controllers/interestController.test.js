const interestController = require('../../../src/api/controllers/interestController');
const interestService = require('../../../src/api/services/interestService');

jest.mock('../../../src/api/services/interestService');

describe('Interest Controller - listAllInterests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all interests when service method succeeds', async () => {
        const mockInterestData = [{ id: 1, name: 'Interest 1' }, { id: 2, name: 'Interest 2' }];
        interestService.getAllInterests.mockResolvedValueOnce(mockInterestData);

        const req = { };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await interestController.listAllInterests(req, res);

        expect(interestService.getAllInterests).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ interests: mockInterestData });
    });

    it('should return a server error if service method fails', async () => {
        const error = new Error('Database error');
        interestService.getAllInterests.mockRejectedValueOnce(error);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await interestController.listAllInterests(req, res);

        expect(interestService.getAllInterests).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});


describe('Interest Controller - getInterestById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the interest when found', async () => {
        const mockInterestId = 1;
        const mockInterestData = { id: 1, name: 'Test Interest' };
        const mockReq = { params: { interestId: mockInterestId } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        interestService.getInterestById.mockResolvedValueOnce(mockInterestData);
        
        await interestController.getInterestById(mockReq, mockRes);

        expect(interestService.getInterestById).toHaveBeenCalledWith(mockInterestId);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ data: mockInterestData });
    });

    it('should return 404 if interest is not found', async () => {
        const mockInterestId = 1;
        const mockReq = { params: { interestId: mockInterestId } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        interestService.getInterestById.mockResolvedValueOnce(null);
        
        await interestController.getInterestById(mockReq, mockRes);

        expect(interestService.getInterestById).toHaveBeenCalledWith(mockInterestId);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Interest not found" });
    });

    it('should return 500 if an error occurs', async () => {
        const mockInterestId = 1;
        const mockReq = { params: { interestId: mockInterestId } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockError = new Error('Database error');

        interestService.getInterestById.mockRejectedValueOnce(mockError);
        
        await interestController.getInterestById(mockReq, mockRes);

        expect(interestService.getInterestById).toHaveBeenCalledWith(mockInterestId);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});
