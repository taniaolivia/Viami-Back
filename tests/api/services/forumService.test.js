const forumService = require("../../../src/api/services/forumService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe('Forum Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getListCitiesForum', () => {
    it('should return list of cities with images', async () => {
      const mockCities = [
        { id: 1, city: 'City 1', image: 1 },
        { id: 2, city: 'City 2', image: 2 },
      ];
      const mockImages = [
        { id: 1, image: 'Image 1' },
        { id: 2, image: 'Image 2' },
      ];
      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => Promise.resolve(mockCities),
        }),
      });
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.resolve(mockImages[0]),
          }),
        }),
      });
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.resolve(mockImages[1]),
          }),
        }),
      });

      const citiesWithImages = await forumService.getListCitiesForum();
      expect(citiesWithImages).toEqual([
        { id: 1, city: 'City 1', image: { id: 1, image: 'Image 1' } },
        { id: 2, city: 'City 2', image: { id: 2, image: 'Image 2' } },
      ]);
    });

    it('should throw an error if failed to get list of cities for forum', async () => {
      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => Promise.reject(new Error('Failed to get list of cities for forum')),
        }),
      });

      await expect(forumService.getListCitiesForum()).rejects.toThrow('Failed to get list of cities for forum');
    });
  });
});
