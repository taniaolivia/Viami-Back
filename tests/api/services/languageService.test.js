const languageService = require("../../../src/api/services/languageService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe('languageService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLanguages', () => {
    it('should return list of languages', async () => {
      const mockLanguages = [
        { id: 1, language: 'Language 1' },
        { id: 2, language: 'Language 2' },
      ];
      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => Promise.resolve(mockLanguages),
        }),
      });

      const result = await languageService.getAllLanguages();
      expect(result).toEqual(mockLanguages);
    });

    it('should throw an error if failed to fetch languages', async () => {
      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => Promise.reject(new Error('Failed to fetch languages')),
        }),
      });

      await expect(languageService.getAllLanguages()).rejects.toThrow('Database error');
    });
  });

  describe('getLanguageById', () => {
    it('should return language by id', async () => {
      const mockLanguage = { id: 1, language: 'Language 1' };
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.resolve(mockLanguage),
          }),
        }),
      });

      const result = await languageService.getLanguageById(1);
      expect(result).toEqual(mockLanguage);
    });

    it('should throw an error if failed to fetch language by id', async () => {
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.reject(new Error('Failed to fetch language by id')),
          }),
        }),
      });

      await expect(languageService.getLanguageById(1)).rejects.toThrow('Database error');
    });
  });
});
