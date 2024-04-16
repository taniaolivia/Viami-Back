const activityCommentService = require("../../../src/api/services/activityCommentService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("activityCommentService", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe("hasUserLeftComment", () => {
      it("should return true if the user has left a comment in an activity", async () => {
        const activityId = 1;
        const otherUserId = 2;
        const mockResults = [{ count: 1 }];
        db.mockReturnValueOnce({
          where: () => ({
            count: () => Promise.resolve(mockResults),
          }),
        });
  
        const hasLeftComment = await activityCommentService.hasUserLeftComment(activityId, otherUserId);
        expect(hasLeftComment).toBe(true);
      });
  
      it("should return false if the user has not left a comment in an activity", async () => {
        const activityId = 1;
        const otherUserId = 2;
        const mockResults = [{ count: 0 }];
        db.mockReturnValueOnce({
          where: () => ({
            count: () => Promise.resolve(mockResults),
          }),
        });
  
        const hasLeftComment = await activityCommentService.hasUserLeftComment(activityId, otherUserId);
        expect(hasLeftComment).toBe(false);
      });
  
      it("should reject with an error if the request is invalid", async () => {
        const activityId = 1;
        const otherUserId = 2;
        db.mockReturnValueOnce({
          where: () => ({
            count: () => Promise.reject(new Error("Invalid request")),
          }),
        });
  
        await expect(activityCommentService.hasUserLeftComment(activityId, otherUserId)).rejects.toThrow("Invalid request");
      });
    });
});
  