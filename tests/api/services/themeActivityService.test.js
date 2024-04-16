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
  
    describe("getFirstFiveActivitiesByTheme", () => {
        it("should return the first five activities for a given theme", async () => {
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
            },
            {
              id: 3,
              name: "Activity 3",
              description: "Description 3",
              location: "Location 3",
              nbParticipant: 30,
              isRecommended: true,
              imageName: "image3.jpg",
              url: "https://example.com/activity3",
              telephone: "345-678-9012",
              address: "789 Oak St",
              latitude: 40.7128,
              longitude: -74.0060,
              schedule: "11:00 AM - 7:00 PM",
              language: "French",
              accessibility: "Partial wheelchair access",
              note: "Note 3"
            },
            {
              id: 4,
              name: "Activity 4",
              description: "Description 4",
              location: "Location 4",
              nbParticipant: 40,
              isRecommended: false,
              imageName: "image4.jpg",
              url: "https://example.com/activity4",
              telephone: "456-789-0123",
              address: "1011 Pine St",
              latitude: 33.9425,
              longitude: -118.4085,
              schedule: "12:00 PM - 8:00 PM",
              language: "English",
              accessibility: "Wheelchair accessible",
              note: "Note 4"
            },
            {
              id: 5,
              name: "Activity 5",
              description: "Description 5",
              location: "Location 5",
              nbParticipant: 50,
              isRecommended: true,
              imageName: "image5.jpg",
              url: "https://example.com/activity5",
              telephone: "567-890-1234",
              address: "1314 Maple St",
              latitude: 37.7749,
              longitude: -122.4194,
              schedule: "1:00 PM - 9:00 PM",
              language: "Spanish",
              accessibility: "No wheelchair access",
              note: "Note 5"
            },
            
          ];
          db.mockReturnValueOnce({
            select: () => ({
              where: () => ({
                join: () => ({
                  join: () => ({
                    orderBy: () => ({
                      limit: () => ({
                        offset: () => Promise.resolve(mockActivities),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          });
      
          const activities = await themeActivityService.getFirstFiveActivitiesByTheme(themeId);
          expect(activities).toEqual(mockActivities.slice(0, 5));
        });
      });

      describe("getFirstFiveActivitiesByTheme", () => {
        it("should throw an error if there is a database error", async () => {
          const themeId = 1;
          const mockError = new Error("Database error");
          db.mockImplementationOnce(() => {
            throw mockError;
          });
      
          try {
            await themeActivityService.getFirstFiveActivitiesByTheme(themeId);
            fail("Expected an error to be thrown");
          } catch (error) {
            expect(error).toEqual(mockError);
          }
        });
      });
      
      
});