const premiumPlanController = require('../../../src/api/controllers/premiumPlanController');
const premiumPlanService = require('../../../src/api/services/premiumPlanService');

jest.mock('../../../src/api/services/premiumPlanService');

describe('Premium Plan Controller - getAllPremiumPlans', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all premium plans', async () => {
        const mockPlans = [{ id: 1, name: 'Plan 1' }, { id: 2, name: 'Plan 2' }];
        premiumPlanService.getAllPremiumPlans.mockResolvedValueOnce(mockPlans);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await premiumPlanController.getAllPremiumPlans(req, res);

        expect(premiumPlanService.getAllPremiumPlans).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ plans: mockPlans });
    });

    it('should return 500 if service method fails', async () => {
        premiumPlanService.getAllPremiumPlans.mockRejectedValueOnce(new Error('Database error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await premiumPlanController.getAllPremiumPlans(req, res);

        expect(premiumPlanService.getAllPremiumPlans).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});


describe('Premium Plan Controller - getPremiumPlanById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the premium plan by id', async () => {
        const mockPlan = { id: 1, name: 'Plan 1' };
        premiumPlanService.getPremiumPlanById.mockResolvedValueOnce(mockPlan);

        const req = { params: { planId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await premiumPlanController.getPremiumPlanById(req, res);

        expect(premiumPlanService.getPremiumPlanById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockPlan);
    });

    it('should return 404 if premium plan is not found', async () => {
        premiumPlanService.getPremiumPlanById.mockResolvedValueOnce(null);

        const req = { params: { planId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await premiumPlanController.getPremiumPlanById(req, res);

        expect(premiumPlanService.getPremiumPlanById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Premium plan not found' });
    });

    it('should return 500 if service method fails', async () => {
        premiumPlanService.getPremiumPlanById.mockRejectedValueOnce(new Error('Database error'));

        const req = { params: { planId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await premiumPlanController.getPremiumPlanById(req, res);

        expect(premiumPlanService.getPremiumPlanById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});