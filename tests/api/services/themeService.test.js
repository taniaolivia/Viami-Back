const themeService = require("../../../src/api/services/themeService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("themeService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("listThemes", () => {
    it("should return a list of themes", async () => {
      const themes = [
        { id: 1, name: "Theme 1" },
        { id: 2, name: "Theme 2" },
        { id: 3, name: "Theme 3" },
      ];

      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => Promise.resolve(themes),
        }),
      });

      const result = await themeService.listThemes();
      expect(result).toEqual(themes);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Database error";

      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => Promise.reject(new Error(errorMessage)),
        }),
      });

      try {
        await themeService.listThemes();
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe("getFiveThemes", () => {
    it("should return five themes", async () => {
      const themes = [
        { id: 1, name: "Theme 1" },
        { id: 2, name: "Theme 2" },
        { id: 3, name: "Theme 3" },
        { id: 4, name: "Theme 4" },
        { id: 5, name: "Theme 5" },
      ];

      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => ({
            limit: () => ({
              offset: () => Promise.resolve(themes),
            }),
          }),
        }),
      });

      const result = await themeService.getFiveThemes();
      expect(result).toEqual(themes);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Database error";

      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => ({
            limit: () => ({
              offset: () => Promise.reject(new Error(errorMessage)),
            }),
          }),
        }),
      });

      try {
        await themeService.getFiveThemes();
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});
