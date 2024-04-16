const languageService = require("../../../src/api/services/userLanguageService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("languageService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const userId = 1;
  const languageId = 101;
  const errorMessage = "Invalid request";

  describe("getAllUsersLanguages", () => {
    it("should retrieve all users' languages", async () => {
      const mockLanguages = [
        { userId: 1, languageId: 101, languageName: "English" },
        { userId: 2, languageId: 102, languageName: "Spanish" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.resolve(mockLanguages)
          })
        })
      });

      const result = await languageService.getAllUsersLanguages();
      expect(result).toEqual(mockLanguages);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Failed to fetch users' languages";
      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.reject(new Error(errorMessage))
          })
        })
      });

      await expect(languageService.getAllUsersLanguages()).rejects.toThrow(errorMessage);
    });
  });

  describe("getUserLanguagesById", () => {
    it("should retrieve languages by user ID", async () => {
      const userId = 1;
      const mockLanguages = [
        { userId: userId, languageId: 101, languageName: "English" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.resolve(mockLanguages)
            })
          })
        })
      });

      const result = await languageService.getUserLanguagesById(userId);
      expect(result).toEqual(mockLanguages);
    });

    it("should throw an error if the database request fails", async () => {
      const userId = 1;
      const errorMessage = "Failed to get user languages by id";
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.reject(new Error(errorMessage))
            })
          })
        })
      });

      await expect(languageService.getUserLanguagesById(userId)).rejects.toThrow(errorMessage);
    });
  });

  describe("getLanguageUsersById", () => {
    it("should retrieve users by language ID", async () => {
      const languageId = 101;
      const mockUsers = [
        { userId: 1, languageId: languageId, userName: "John Doe" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.resolve(mockUsers)
            })
          })
        })
      });

      const result = await languageService.getLanguageUsersById(languageId);
      expect(result).toEqual(mockUsers);
    });

    it("should throw an error if the database request fails", async () => {
      const languageId = 101;
      const errorMessage = "Failed to get users with the same language by id";
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.reject(new Error(errorMessage))
            })
          })
        })
      });

      await expect(languageService.getLanguageUsersById(languageId)).rejects.toThrow(errorMessage);
    });
  });

  describe("addUserLanguage", () => {
    it("should add a language to a user's data", async () => {
      // Simule la réponse de l'insertion
      db.mockReturnValueOnce({
        insert: () => Promise.resolve([languageId]) // Supposons que l'insertion retourne un ID
      });
  
      // Simule la récupération des données utilisateur après insertion
      db.mockReturnValueOnce({
        select: () => ({
          where: () => Promise.resolve([{ id: userId, name: "John Doe" }])
        })
      });
  
      // Simule la récupération des données de langue après insertion
      db.mockReturnValueOnce({
        select: () => ({
          where: () => Promise.resolve([{ id: languageId, language: "English" }])
        })
      });
  
      const result = await languageService.addUserLanguage(userId, languageId);
      expect(result.message).toEqual("Language is added to user's data");
      expect(result.user).toEqual([{ id: userId, name: "John Doe" }]);
      expect(result.language).toEqual([{ id: languageId, language: "English" }]);
    });
  
    it("should throw an error if the database request fails during the insert operation", async () => {
      db.mockReturnValueOnce({
        insert: () => Promise.reject(new Error("Invalid request")) // Simule correctement un échec
      });
  
      await expect(languageService.addUserLanguage(userId, languageId)).rejects.toThrow("Invalid request");
    });
  });
  

  describe("deleteUserLanguage", () => {
    it("should delete a user's language", async () => {
      db.mockReturnValueOnce({
        delete: () => ({
          where: () => Promise.resolve()
        })
      });

      const result = await languageService.deleteUserLanguage(userId, languageId);
      expect(result).toEqual({ message: "Language is deleted from user's data" });
    });

    it("should throw an error if the database request fails", async () => {
      db.mockReturnValueOnce({
        delete: () => ({
          where: () => Promise.reject(new Error(errorMessage))
        })
      });

      await expect(languageService.deleteUserLanguage(userId, languageId)).rejects.toThrow(errorMessage);
    });
  });

  describe("deleteAllLanguagesByUserId", () => {
    it("should delete all languages for a user", async () => {
      db.mockReturnValueOnce({
        delete: () => ({
          where: () => Promise.resolve()
        })
      });

      const result = await languageService.deleteAllLanguagesByUserId(userId);
      expect(result).toEqual({ message: "All languages are deleted from user's data" });
    });

    it("should throw an error if the database request fails", async () => {
      db.mockReturnValueOnce({
        delete: () => ({
          where: () => Promise.reject(new Error(errorMessage))
        })
      });

      await expect(languageService.deleteAllLanguagesByUserId(userId)).rejects.toThrow(errorMessage);
    });
  });
});

