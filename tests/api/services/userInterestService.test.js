const interestService = require("../../../src/api/services/userInterestService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("interestService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsersInterests", () => {
    it("should retrieve all users' interests", async () => {
      const mockInterests = [
        { userId: 1, interestId: 101, interest: "Reading" },
        { userId: 2, interestId: 102, interest: "Hiking" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.resolve(mockInterests)
          })
        })
      });

      const result = await interestService.getAllUsersInterests();
      expect(result).toEqual(mockInterests);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Server error";
      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.reject(new Error(errorMessage))
          })
        })
      });

      await expect(interestService.getAllUsersInterests()).rejects.toThrow(errorMessage);
    });
  });

  describe("getInterestUsersById", () => {
    it("should retrieve users by interest ID", async () => {
      const interestId = 101;
      const mockUserInterests = [
        { userId: 1, interestId: interestId, interest: "Reading" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.resolve(mockUserInterests)
            })
          })
        })
      });

      const result = await interestService.getInterestUsersById(interestId);
      expect(result).toEqual(mockUserInterests);
    });

    it("should throw an error if the database request fails", async () => {
      const interestId = 101;
      const errorMessage = "Server error";
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.reject(new Error(errorMessage))
            })
          })
        })
      });

      await expect(interestService.getInterestUsersById(interestId)).rejects.toThrow(errorMessage);
    });
  });

  describe("getUserInterestsById", () => {
    it("should retrieve interests by user ID", async () => {
      const userId = 1;
      const mockInterests = [
        { userId: userId, interestId: 101, interest: "Reading" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.resolve(mockInterests)
            })
          })
        })
      });

      const result = await interestService.getUserInterestsById(userId);
      expect(result).toEqual(mockInterests);
    });

    it("should throw an error if the database request fails", async () => {
      const userId = 1;
      const errorMessage = "Server error";
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.reject(new Error(errorMessage))
            })
          })
        })
      });

      await expect(interestService.getUserInterestsById(userId)).rejects.toThrow(errorMessage);
    });
  });

  describe("addUserInterest", () => {
    const userId = 1;
    const interestId = 101;
    
    it("should add an interest to a user's data", async () => {
      // Simuler la réponse de l'insertion
      db.mockReturnValueOnce({
        insert: () => Promise.resolve([1]) // Supposons que l'insertion retourne un ID
      });

      // Simuler la récupération des données utilisateur
      db.mockReturnValueOnce({
        select: () => ({
          where: () => Promise.resolve([{ id: userId, name: "John Doe" }])
        })
      });

      // Simuler la récupération des données d'intérêt
      db.mockReturnValueOnce({
        select: () => ({
          where: () => Promise.resolve([{ id: interestId, interest: "Hiking" }])
        })
      });

      const result = await interestService.addUserInterest(userId, interestId);
      expect(result.message).toEqual("Interest is added to user's data");
      expect(result.user).toEqual([{ id: userId, name: "John Doe" }]);
      expect(result.interest).toEqual([{ id: interestId, interest: "Hiking" }]);
    });

    it("should throw an error if the database request fails during the insert operation", async () => {
      // Simuler un échec lors de l'insertion
      db.mockReturnValueOnce({
        insert: () => Promise.reject(new Error("Failed to add interest to user's data"))
      });

      await expect(interestService.addUserInterest(userId, interestId)).rejects.toThrow("Failed to add interest to user's data");
    });
  });
});

  

