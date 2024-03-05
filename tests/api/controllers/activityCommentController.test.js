const db = require("../../../src/api/knex");
const activityCommentController = require("../../../src/api/controllers/activityCommentController");

describe('Activity Comment Controller Tests', () => {
    test('hasUserLeftComment should return true if user has left a comment', async () => {
        db.mockReturnValueOnce(Promise.resolve([{ count: 1 }]));

        const hasLeftComment = await activityCommentController.hasUserLeftComment({ params: { activityId: 1, otherUserId: 2 } });

        expect(hasLeftComment).toBe(true);
    });
});
