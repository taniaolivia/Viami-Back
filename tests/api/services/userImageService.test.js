const userService = require("../../../src/api/services/userImageService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("userService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsersImages", () => {
    it("should retrieve all users' images", async () => {
      const mockUsersImages = [
        { userId: 1, imageId: 101, imageUrl: "image1.jpg" },
        { userId: 2, imageId: 102, imageUrl: "image2.jpg" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.resolve(mockUsersImages)
          })
        })
      });

      const result = await userService.getAllUsersImages();
      expect(result).toEqual(mockUsersImages);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Failed to fetch users' images";
      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.reject(new Error(errorMessage))
          })
        })
      });

      await expect(userService.getAllUsersImages()).rejects.toThrow(errorMessage);
    });
  });

  describe("getUserImagesById", () => {
    it("should retrieve user's images by user ID", async () => {
      const userId = 1;
      const mockUserImages = [
        { userId: userId, imageId: 101, imageUrl: "user1image.jpg" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.resolve(mockUserImages)
            })
          })
        })
      });

      const result = await userService.getUserImagesById(userId);
      expect(result).toEqual(mockUserImages);
    });

    it("should throw an error if the database request fails", async () => {
      const userId = 1;
      const errorMessage = "Failed to get user's images by id";
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.reject(new Error(errorMessage))
            })
          })
        })
      });

      await expect(userService.getUserImagesById(userId)).rejects.toThrow(errorMessage);
    });
  });
});
