const themeActivityService = require("../../../src/api/services/themeActivityService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("themeActivityService", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe("listActivitiesByTheme", () => {
      it("should return activities for a given theme", async () => {
        const themeId = 1;
        const mockActivities = [
          {
            id: 1,
            name: "Activity 1",
            description: "Description 1",
            location: "Location 1",
            nbParticipant: 10,
            isRecommended: true,
            imageName: "image1.jpg",
            url: "https://example.com/activity1",
            telephone: "123-456-7890",
            address: "123 Main St",
            latitude: 37.7749,
            longitude: -122.4194,
            schedule: "9:00 AM - 5:00 PM",
            language: "English",
            accessibility: "Wheelchair accessible",
            note: "Note 1"
          },
          {
            id: 2,
            name: "Activity 2",
            description: "Description 2",
            location: "Location 2",
            nbParticipant: 20,
            isRecommended: false,
            imageName: "image2.jpg",
            url: "https://example.com/activity2",
            telephone: "234-567-8901",
            address: "456 Elm St",
            latitude: 34.0522,
            longitude: -118.2437,
            schedule: "10:00 AM - 6:00 PM",
            language: "Spanish",
            accessibility: "No wheelchair access",
            note: "Note 2"
          }
        ];
        db.mockReturnValueOnce({
          select: () => ({
            where: () => ({
              join: () => ({
                join: () => ({
                  orderBy: () => Promise.resolve(mockActivities),
                }),
              }),
            }),
          }),
        });
  
        const activities = await themeActivityService.listActivitiesByTheme(themeId);
        expect(activities).toEqual(mockActivities);
      });
    });
  
  });
  