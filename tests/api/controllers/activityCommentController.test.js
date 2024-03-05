/*const db = require("../knex");
const activityCommentController = require("../controllers/activityCommentController");

describe('Activity Comment Controller Tests', () => {
    test('hasUserLeftComment should return true if user has left a comment', async () => {
        // Mocking the database function
        db.mockReturnValueOnce(Promise.resolve([{ count: 1 }]));

        const hasLeftComment = await activityCommentController.hasUserLeftComment({ params: { activityId: 1, otherUserId: 2 } });

        expect(hasLeftComment).toBe(true);
    });

    // Add more tests for different scenarios
});
*/