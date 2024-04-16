const interestService = require("../../../src/api/services/interestService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe('interestService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllInterests', () => {
    it('should return list of interests', async () => {
      const mockInterests = [
        { id: 1, interest: 'Interest 1' },
        { id: 2, interest: 'Interest 2' },
      ];
      db.mockReturnValueOnce({
        select: () => Promise.resolve(mockInterests),
      });

      const result = await interestService.getAllInterests();
      expect(result).toEqual(mockInterests);
    });
  });

  describe('getInterestById', () => {
    it('should return interest by id', async () => {
      const mockInterest = { id: 1, interest: 'Interest 1' };
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.resolve(mockInterest),
          }),
        }),
      });

      const result = await interestService.getInterestById(1);
      expect(result).toEqual(mockInterest);
    });

    it('should throw an error if failed to fetch interest by id', async () => {
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.reject(new Error('Failed to fetch interest by id')),
          }),
        }),
      });

      await expect(interestService.getInterestById(1)).rejects.toThrow('Database error');
    });
  });
});
