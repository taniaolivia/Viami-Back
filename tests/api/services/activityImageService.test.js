const activityImageService = require("../../../src/api/services/activityImageService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("activityImageService", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe("getAllActivitiesImages", () => {
      it("should return all activity images", async () => {
        const mockActivityImages = [
          {
            id: 1,
            idImage: 1,
            idActivity: 1,
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
            image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            note: "Note 1"
          },
          {
            id: 2,
            idImage: 2,
            idActivity: 2,
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
            image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            note: "Note 2"
          }
        ];

        db.mockReturnValueOnce({
          select: () => ({
            join: () => ({
              join: () => Promise.resolve(mockActivityImages),
            }),
          }),
        });
  
        const activityImages = await activityImageService.getAllActivitiesImages();
        expect(activityImages).toEqual(mockActivityImages);
      });
    });
  
    describe("getActivityImagesById", () => {
        it("should return activity images for a given activity ID", async () => {
          const activityId = 1;
          const mockActivityImages = [
            {
              id: 1,
              idImage: 1,
              idActivity: 1,
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
              image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
              note: "Note 1"
            },
            {
              id: 2,
              idImage: 2,
              idActivity: 1,
              name: "Activity 1",
              description: "Description 1",
              location: "Location 1",
              nbParticipant: 10,
              isRecommended: true,
              imageName: "image2.jpg",
              url: "https://example.com/activity1",
              telephone: "123-456-7890",
              address: "123 Main St",
              latitude: 37.7749,
              longitude: -122.4194,
              schedule: "9:00 AM - 5:00 PM",
              language: "English",
              accessibility: "Wheelchair accessible",
              image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
              note: "Note 1"
            }
          ];

          db.mockReturnValueOnce({
            select: () => ({
              where: () => ({
                join: () => ({
                  join: () => Promise.resolve(mockActivityImages),
                }),
              }),
            }),
          });
    
          const activityImages = await activityImageService.getActivityImagesById(activityId);
          expect(activityImages).toEqual(mockActivityImages);
        });
      });
    
      describe("addImageToActivity", () => {
        it("should add an image to an activity", async () => {
          const image = {
            image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          };
          const activityId = 1;
          const mockImageId = [1];
          const mockActivityData = [
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
            }
          ];

          db.mockReturnValueOnce({
            insert: () => ({
              returning: () => Promise.resolve(mockImageId),
            }),
          });

          db.mockReturnValueOnce({
            insert: () => Promise.resolve(),
          });

          db.mockReturnValueOnce({
            select: () => ({
              where: () => Promise.resolve(mockActivityData),
            }),
          });
    
          const result = await activityImageService.addImageToActivity(image, activityId);
          expect(result).toEqual({ imageId: mockImageId[0], activityData: mockActivityData });
        });

        it("should throw an error if the request is invalid", async () => {
            const image = {
              image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            };
            const activityId = 1;
      
            db.mockReturnValueOnce({
              insert: () => ({
                returning: () => Promise.reject(new Error("Invalid request")),
              }),
            });
      
            await expect(activityImageService.addImageToActivity(image, activityId)).rejects.toThrow("Invalid request");
        });
    });
    
    describe("deleteActivityImage", () => {
        it("should delete an image from an activity", async () => {
            const imageId = 1;
            const activityId = 1;

            db.mockReturnValueOnce({
                delete: () => ({
                where: () => Promise.resolve(),
                }),
            });
            db.mockReturnValueOnce({
                delete: () => ({
                where: () => Promise.resolve(),
                }),
            });
        
            await activityImageService.deleteActivityImage(imageId, activityId);
            expect(db.mock.calls.length).toBe(2);
        });

        it("should throw an error if the request is invalid", async () => {
            const imageId = 1;
            const activityId = 1;
      
            db.mockReturnValueOnce({
              delete: () => ({
                where: () => Promise.reject(new Error("Invalid request")),
              }),
            });
      
            await expect(activityImageService.deleteActivityImage(imageId, activityId)).rejects.toThrow("Invalid request");
        });
    });
});
  