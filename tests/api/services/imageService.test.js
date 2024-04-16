const imageService = require("../../../src/api/services/imageService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe('imageService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listAllImages', () => {
    it('should return list of images', async () => {
      const mockImages = [
        { id: 1, image: 'Image 1' },
        { id: 2, image: 'Image 2' },
      ];
      db.mockReturnValueOnce({
        select: () => Promise.resolve(mockImages),
      });

      const result = await imageService.listAllImages();
      expect(result).toEqual({ images: mockImages });
    });

    it('should throw an error if failed to list all images', async () => {
      db.mockReturnValueOnce({
        select: () => Promise.reject(new Error('Failed to list all images')),
      });

      await expect(imageService.listAllImages()).rejects.toThrow('Server error');
    });
  });

  describe('getImageById', () => {
    it('should return image by id', async () => {
      const mockImage = { id: 1, image: 'Image 1' };
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.resolve(mockImage),
          }),
        }),
      });

      const result = await imageService.getImageById(1);
      expect(result).toEqual(mockImage);
    });

    it('should throw an error if failed to fetch image by id', async () => {
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.reject(new Error('Failed to fetch image by id')),
          }),
        }),
      });

      await expect(imageService.getImageById(1)).rejects.toThrow('Failed to fetch image by id');
    });
  });
});
