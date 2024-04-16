const travelActivityService = require("../../../src/api/services/travelActivityService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("travelActivityService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTravelsActivities", () => {
    it("should return all travel activities", async () => {
      const travelActivities = [
        { id: 1, name: "Activity 1" },
        { id: 2, name: "Activity 2" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.resolve(travelActivities)
          })
        })
      });

      const result = await travelActivityService.getAllTravelsActivities();
      expect(result).toEqual(travelActivities);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Database error";

      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.reject(new Error(errorMessage))
          })
        })
      });

      try {
        await travelActivityService.getAllTravelsActivities();
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe("getTravelActivitiesById", () => {
    it("should return travel activities by ID", async () => {
      const travelActivities = [
        { id: 1, name: "Activity 1" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.resolve(travelActivities)
            })
          })
        })
      });

      const result = await travelActivityService.getTravelActivitiesById(1);
      expect(result).toEqual(travelActivities);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Database error";

      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.reject(new Error(errorMessage))
            })
          })
        })
      });

      try {
        await travelActivityService.getTravelActivitiesById(1);
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe("addActivityToTravel", () => {
    it("should add an activity to a travel", async () => {
      const activity = { name: "New Activity", description: "Fun activity" };
      const travelId = 3;
      const activityId = 10;
      const travelData = { name: "Adventure Travel", description: "Exciting travel" };

      db.mockReturnValueOnce({
        insert: () => Promise.resolve([activityId])
      }).mockReturnValueOnce({
        insert: () => Promise.resolve()
      }).mockReturnValueOnce({
        select: () => ({
          where: () => Promise.resolve([travelData])
        })
      });

      const result = await travelActivityService.addActivityToTravel(activity, travelId);
      expect(result).toEqual({ message: 'Activity is added to travel\'s data', travel: [travelData], activity: activity });
    });

    it("should throw an error if the request fails", async () => {
      const errorMessage = "Invalid request";
      const activity = { name: "New Activity", description: "Fun activity" };
      const travelId = 3;

      db.mockReturnValueOnce({
        insert: () => Promise.reject(new Error(errorMessage))
      });

      try {
        await travelActivityService.addActivityToTravel(activity, travelId);
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

 
    it("should throw an error if the deletion request fails", async () => {
      const errorMessage = "Invalid request";
      const activityId = 10;
      const travelId = 3;

      db.mockReturnValueOnce({
        where: () => ({
          delete: () => Promise.resolve()
        })
      }).mockReturnValueOnce({
        where: () => ({
          delete: () => Promise.reject(new Error(errorMessage))
        })
      });

      try {
        await travelActivityService.deleteTravelActivity(activityId, travelId);
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

