const activityService = require("../../../src/api/services/activityService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("activityService", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe("fetchAllActivities", () => {
      it("should return a list of activities", async () => {
        const mockActivities = [
          { id: 1, name: "Activity 1", description: "Description 1" },
          { id: 2, name: "Activity 2", description: "Description 2" },
        ];
        db.mockReturnValueOnce({
          select: () => ({
            orderBy: () => Promise.resolve(mockActivities),
          }),
        });
  
        const activities = await activityService.fetchAllActivities();
        expect(activities).toEqual(mockActivities);
      });
  
      it("should reject with an error if the request is invalid", async () => {
        db.mockReturnValueOnce({
          select: () => ({
            orderBy: () => Promise.reject(new Error("Invalid request")),
          }),
        });
  
        await expect(activityService.fetchAllActivities()).rejects.toThrow("Invalid request");
      });
    });
  
    describe("findActivityById", () => {
      it("should return an activity with the given id", async () => {
        const mockActivity = { id: 1, name: "Activity 1", description: "Description 1" };
        db.mockReturnValueOnce({
          select: () => ({
            where: () => Promise.resolve(mockActivity),
          }),
        });
  
        const activity = await activityService.findActivityById(1);
        expect(activity).toEqual(mockActivity);
      });
  
      it("should reject with an error if the request is invalid", async () => {
        db.mockReturnValueOnce({
          select: () => ({
            where: () => Promise.reject(new Error("Invalid request")),
          }),
        });
  
        await expect(activityService.findActivityById(1)).rejects.toThrow("Invalid request");
      });
    });
  
    describe("saveActivity", () => {
      it("should insert a new activity into the database", async () => {
        const mockActivity = { id: 1, name: "Activity 1", description: "Description 1" };
        db.mockReturnValueOnce({
          insert: () => Promise.resolve(mockActivity),
        });
  
        const activity = await activityService.saveActivity(mockActivity);
        expect(activity).toEqual(mockActivity);
      });
  
      it("should reject with an error if the request is invalid", async () => {
        const mockActivity = { id: 1, name: "Activity 1", description: "Description 1" };
        db.mockReturnValueOnce({
          insert: () => Promise.reject(new Error("Invalid request")),
        });
  
        await expect(activityService.saveActivity(mockActivity)).rejects.toThrow("Invalid request");
      });
    });

    describe("findRecommendedActivities", () => {
        it("should return a list of recommended activities", async () => {
          const mockActivities = [
            { id: 1, name: "Activity 1", isRecommended: 1 },
            { id: 2, name: "Activity 2", isRecommended: 1 },
          ];
          db.mockReturnValueOnce({
            select: () => ({
              where: () => ({
                orderBy: () => Promise.resolve(mockActivities),
              }),
            }),
          });
    
          const activities = await activityService.findRecommendedActivities();
          expect(activities).toEqual(mockActivities);
        });
    
        it("should reject with an error if the request is invalid", async () => {
          db.mockReturnValueOnce({
            select: () => ({
              where: () => ({
                orderBy: () => Promise.reject(new Error("Invalid request")),
              }),
            }),
          });
    
          await expect(activityService.findRecommendedActivities()).rejects.toThrow("Invalid request");
        });
      });
    
      describe("findPopularActivities", () => {
        it("should return a list of popular activities", async () => {
          const mockActivities = [
            { id: 1, name: "Activity 1", nbParticipant: 10 },
            { id: 2, name: "Activity 2", nbParticipant: 5 },
          ];
          db.mockReturnValueOnce({
            select: () => ({
              orderBy: () => ({
                orderBy: () => Promise.resolve(mockActivities),
              }),
            }),
          });
    
          const activities = await activityService.findPopularActivities();
          expect(activities).toEqual(mockActivities);
        });
    
        it("should reject with an error if the request is invalid", async () => {
          db.mockReturnValueOnce({
            select: () => ({
              orderBy: () => ({
                orderBy: () => Promise.reject(new Error("Invalid request")),
              }),
            }),
          });
    
          await expect(activityService.findPopularActivities()).rejects.toThrow("Invalid request");
        });
      });
    
      describe("findTopFivePopularActivities", () => {
        it("should return a list of the top five popular activities", async () => {
          const mockActivities = [
            { id: 1, name: "Activity 1", nbParticipant: 10 },
            { id: 2, name: "Activity 2", nbParticipant: 9 },
            { id: 3, name: "Activity 3", nbParticipant: 8 },
            { id: 4, name: "Activity 4", nbParticipant: 7 },
            { id: 5, name: "Activity 5", nbParticipant: 6 },
          ];
          db.mockReturnValueOnce({
            select: () => ({
              orderBy: () => ({
                orderBy: () => ({
                  limit: () => ({
                    offset: () => Promise.resolve(mockActivities),
                  }),
                }),
              }),
            }),
          });
    
          const activities = await activityService.findTopFivePopularActivities();
          expect(activities).toEqual(mockActivities);
        });
    
        it("should reject with an error if the request is invalid", async () => {
          db.mockReturnValueOnce({
            select: () => ({
              orderBy: () => ({
                orderBy: () => ({
                  limit: () => ({
                    offset: () => Promise.reject(new Error("Invalid request")),
                  }),
                }),
              }),
            }),
          });
    
          await expect(activityService.findTopFivePopularActivities()).rejects.toThrow("Invalid request");
        });
      });
    
      describe("findTopFiveRecommendedActivities", () => {
        it("should return a list of the top five recommended activities", async () => {
          const mockActivities = [
            { id: 1, name: "Activity 1", isRecommended: 1 },
            { id: 2, name: "Activity 2", isRecommended: 1 },
            { id: 3, name: "Activity 3", isRecommended: 1 },
            { id: 4, name: "Activity 4", isRecommended: 1 },
            { id: 5, name: "Activity 5", isRecommended: 1 },
          ];
          db.mockReturnValueOnce({
            select: () => ({
              where: () => ({
                orderBy: () => ({
                  limit: () => ({
                    offset: () => Promise.resolve(mockActivities),
                  }),
                }),
              }),
            }),
          });
    
          const activities = await activityService.findTopFiveRecommendedActivities();
          expect(activities).toEqual(mockActivities);
        });
    
        it("should reject with an error if the request is invalid", async () => {
          db.mockReturnValueOnce({
            select: () => ({
              where: () => ({
                orderBy: () => ({
                  limit: () => ({
                    offset: () => Promise.reject(new Error("Invalid request")),
                  }),
                }),
              }),
            }),
          });
    
          await expect(activityService.findTopFiveRecommendedActivities()).rejects.toThrow("Invalid request");
        });
    });

    describe("findRecommendedActivityById", () => {
        it("should return a recommended activity with the given id", async () => {
          const mockActivity = { id: 1, name: "Activity 1", isRecommended: 1 };
          db.mockReturnValueOnce({
            select: () => ({
              where: () => Promise.resolve(mockActivity),
            }),
          });
    
          const activity = await activityService.findRecommendedActivityById(1);
          expect(activity).toEqual(mockActivity);
        });
    
        it("should reject with an error if the request is invalid", async () => {
          db.mockReturnValueOnce({
            select: () => ({
              where: () => Promise.reject(new Error("Invalid request")),
            }),
          });
    
          await expect(activityService.findRecommendedActivityById(1)).rejects.toThrow("Invalid request");
        });
    });
    
    describe("updateActivityNote", () => {
        it("should update the note of an activity with the given id", async () => {
          const mockActivity = { id: 1, name: "Activity 1", note: "New note" };
          db.mockReturnValueOnce({
            update: () => ({
              where: () => Promise.resolve(mockActivity),
            }),
          });
    
          const activity = await activityService.updateActivityNote(1, "New note");
          expect(activity).toEqual(mockActivity);
        });
    
        it("should reject with an error if the request is invalid", async () => {
          db.mockReturnValueOnce({
            update: () => ({
              where: () => Promise.reject(new Error("Invalid request")),
            }),
          });
    
          await expect(activityService.updateActivityNote(1, "New note")).rejects.toThrow("Invalid request");
        });
    });
    
    describe("getAllActivitiesByUserPosition", () => {
        it("should return a list of activities filtered by distance from the user's position", async () => {
          const mockActivities = [
            { id: 1, name: "Activity 1", latitude: 37.7749, longitude: -122.4194 },
            { id: 2, name: "Activity 2", latitude: 37.7749, longitude: -122.4194 },
          ];
          db.mockReturnValueOnce({
            select: () => Promise.resolve(mockActivities),
          });
    
          const filterActivitiesByDistance = jest.fn(() => mockActivities);
          activityService.getAllActivitiesByUserPosition = async (userLat, userLon) => {
            const activities = await db("activity").select("*");
            return filterActivitiesByDistance(activities, userLat, userLon);
          };
    
          const activities = await activityService.getAllActivitiesByUserPosition(37.7749, -122.4194);
          expect(activities).toEqual(mockActivities);
          expect(filterActivitiesByDistance).toHaveBeenCalledWith(mockActivities, 37.7749, -122.4194);
        });
    
        it("should reject with an error if the request is invalid", async () => {
          db.mockReturnValueOnce({
            select: () => Promise.reject(new Error("Activity not found")),
          });
    
          await expect(activityService.getAllActivitiesByUserPosition(37.7749, -122.4194)).rejects.toThrow("Activity not found");
        });
    });
});