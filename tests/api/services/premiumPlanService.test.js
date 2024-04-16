const premiumPlanService = require("../../../src/api/services/premiumPlanService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe('premiumPlanService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPremiumPlans', () => {
    it('should return list of premium plans', async () => {
      const mockPlans = [
        { id: 1, plan: 'Plan 1' },
        { id: 2, plan: 'Plan 2' },
      ];
      db.mockReturnValueOnce({
        select: () => Promise.resolve(mockPlans),
      });

      const result = await premiumPlanService.getAllPremiumPlans();
      expect(result).toEqual(mockPlans);
    });

    it('should throw an error if failed to fetch premium plans', async () => {
      db.mockReturnValueOnce({
        select: () => Promise.reject(new Error('Failed to fetch premium plans')),
      });

      await expect(premiumPlanService.getAllPremiumPlans()).rejects.toThrow('Server error');
    });
  });

  describe('getPremiumPlanById', () => {
    it('should return premium plan by id', async () => {
      const mockPlan = [{ id: 1, plan: 'Plan 1' }];
      db.mockReturnValueOnce({
        select: () => ({
          where: () => Promise.resolve(mockPlan),
        }),
      });

      const result = await premiumPlanService.getPremiumPlanById(1);
      expect(result).toEqual(mockPlan);
    });

    it('should throw an error if failed to fetch premium plan by id', async () => {
      db.mockReturnValueOnce({
        select: () => ({
          where: () => Promise.reject(new Error('Failed to fetch premium plan by id')),
        }),
      });

      await expect(premiumPlanService.getPremiumPlanById(1)).rejects.toThrow('Database error');
    });
  });
});
