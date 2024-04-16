const commentService = require("../../../src/api/services/commentService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("commentService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("listAllComments", () => {
    it("should return all comments", async () => {
      const mockComments = [{ id: 1, text: "Comment 1" }, { id: 2, text: "Comment 2" }];
      db.mockReturnValueOnce({
        select: () => Promise.resolve(mockComments),
      });

      const comments = await commentService.listAllComments();
      expect(comments).toEqual(mockComments);
    });
  });

  describe("getCommentById", () => {
    it("should return a comment by id", async () => {
      const mockComment = { id: 1, text: "Comment 1" };
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.resolve(mockComment),
          }),
        }),
      });

      const comment = await commentService.getCommentById(1);
      expect(comment).toEqual(mockComment);
    });
  });
});
