const userPremiumPlanController = require('../../../src/api/controllers/userPremiumPlanController');
const userPremiumPlanService = require('../../../src/api/services/userPremiumPlanService');
const jwt = require("jsonwebtoken");
jest.mock('../../../src/api/services/userPremiumPlanService');

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
  }));

describe('User Premium Plan Controller - getUserLastPremiumPlan', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the latest user premium plan', async () => {
        const userId = 1;
        const req = { params: { userId } };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockPlan = { id: 1, userId: 1, planType: 'premium', startDate: '2024-02-20', endDate: '2024-03-20' };
        userPremiumPlanService.getUserLastPremiumPlan.mockResolvedValueOnce([mockPlan]);

        await userPremiumPlanController.getUserLastPremiumPlan(req, res);

        expect(userPremiumPlanService.getUserLastPremiumPlan).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([mockPlan]);
    });

    it('should return 401 if failed to get user last premium plan', async () => {
        const userId = 1;
        const req = { params: { userId } };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userPremiumPlanService.getUserLastPremiumPlan.mockRejectedValueOnce(new Error('Server error'));

        await userPremiumPlanController.getUserLastPremiumPlan(req, res);

        expect(userPremiumPlanService.getUserLastPremiumPlan).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});


describe('User Premium Plan Controller - addUserPremiumPlan', () => {
    it('should add a new premium plan to user\'s data', async () => {
        const userId = 'mockUserId';
        const planId = 'mockPlanId';
        const mockResponse = { message: 'Premium plan added successfully' };

        userPremiumPlanService.addUserPremiumPlan.mockResolvedValueOnce(mockResponse);

        const req = { params: { userId }, body: { planId } };
        const res = { status: jest.fn(), json: jest.fn() };
        res.status.mockReturnThis(); 

        await userPremiumPlanController.addUserPremiumPlan(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockResponse);
        expect(userPremiumPlanService.addUserPremiumPlan).toHaveBeenCalledWith(userId, planId);
    });

    it('should return 401 if failed to add premium plan', async () => {
        const userId = 'mockUserId';
        const planId = 'mockPlanId';
        const errorMessage = 'Failed to add premium plan';

        userPremiumPlanService.addUserPremiumPlan.mockRejectedValueOnce(new Error(errorMessage));

        const req = { params: { userId }, body: { planId } };
        const res = { status: jest.fn(), json: jest.fn() };
        res.status.mockReturnThis(); 

        await userPremiumPlanController.addUserPremiumPlan(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        expect(userPremiumPlanService.addUserPremiumPlan).toHaveBeenCalledWith(userId, planId);
    });
});