const userCommentsService = require("../../../src/api/services/userCommentService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("userCommentsService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsersComments", () => {
    it("should retrieve all users comments", async () => {
      const mockComments = [
        { userId: 1, commentId: 2, comment: "Nice job!" },
        { userId: 1, commentId: 3, comment: "Great work!" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.resolve(mockComments)
          })
        })
      });

      const result = await userCommentsService.getAllUsersComments();
      expect(result).toEqual(mockComments);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Failed to get all users comments";
      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.reject(new Error(errorMessage))
          })
        })
      });

      await expect(userCommentsService.getAllUsersComments()).rejects.toThrow(errorMessage);
    });
  });

  describe("getUserCommentsById", () => {
    it("should return user comments by ID", async () => {
      const userId = 1;
      const mockUserComments = [
        { userId: userId, commentId: 2, comment: "Nice job!" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.resolve(mockUserComments)
            })
          })
        })
      });

      const result = await userCommentsService.getUserCommentsById(userId);
      expect(result).toEqual(mockUserComments);
    });

    it("should throw an error if the database request fails", async () => {
      const userId = 1;
      const errorMessage = "Failed to get user comments by id";
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.reject(new Error(errorMessage))
            })
          })
        })
      });

      await expect(userCommentsService.getUserCommentsById(userId)).rejects.toThrow(errorMessage);
    });
  });

  describe("addCommentToUserProfile", () => {
    it("should add a comment to a user's profile", async () => {
      const userId = 1;
      const commenterId = 2;
      const commentText = "Great work!";
      const mockCommentId = [10];

      db.mockReturnValueOnce({
        insert: () => Promise.resolve(mockCommentId)
      }).mockReturnValueOnce({
        insert: () => Promise.resolve()
      });

      const result = await userCommentsService.addCommentToUserProfile(userId, commenterId, commentText);
      expect(result).toEqual({ message: 'Comment added successfully' });
    });

    it("should throw an error if the database request fails", async () => {
      const userId = 1;
      const commenterId = 2;
      const commentText = "Great work!";
      const errorMessage = "Internal server error";

      db.mockReturnValueOnce({
        insert: () => Promise.reject(new Error(errorMessage))
      });

      await expect(userCommentsService.addCommentToUserProfile(userId, commenterId, commentText)).rejects.toThrow(errorMessage);
    });
  });

  describe("hasUserLeftComment", () => {
    it("should check if a user has left a comment on another user's profile", async () => {
      const userId = 1;
      const otherUserId = 2;
      const mockResult = { count: 1 };

      db.mockReturnValueOnce({
        count: () => ({
          where: () => ({
            first: () => Promise.resolve(mockResult)
          })
        })
      });

      const result = await userCommentsService.hasUserLeftComment(userId, otherUserId);
      expect(result).toEqual({ hasUserLeftComment: true });
    });

    it("should throw an error if the database request fails", async () => {
      const userId = 1;
      const otherUserId = 2;
      const errorMessage = "Internal server error";

      db.mockReturnValueOnce({
        count: () => ({
          where: () => ({
            first: () => Promise.reject(new Error(errorMessage))
          })
        })
      });

      await expect(userCommentsService.hasUserLeftComment(userId, otherUserId)).rejects.toThrow(errorMessage);
    });
  });

});
