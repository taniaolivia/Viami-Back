const activityController = require('../../../src/api/controllers/activityController');
const activityService = require('../../../src/api/services/activityService');

jest.mock('../../../src/api/services/activityService');

const mockTopFivePopularActivities = [
    { id: 1, name: 'Cycling', nbParticipant: 100, isRecommended: 0 },
    { id: 2, name: 'Running', nbParticipant: 90, isRecommended: 1 },
    { id: 3, name: 'Swimming', nbParticipant: 85, isRecommended: 0 },
    { id: 4, name: 'Hiking', nbParticipant: 80, isRecommended: 1 },
    { id: 5, name: 'Walking', nbParticipant: 75, isRecommended: 0 }
];

const mockTopFiveRecommendedActivities = [
    { id: 2, name: 'Running', nbParticipant: 90, isRecommended: 1 },
    { id: 4, name: 'Hiking', nbParticipant: 80, isRecommended: 1 },
    { id: 6, name: 'Yoga', nbParticipant: 70, isRecommended: 1 },
    { id: 8, name: 'Pilates', nbParticipant: 65, isRecommended: 1 },
    { id: 10, name: 'Dance', nbParticipant: 60, isRecommended: 1 }
];

const mockRecommendedActivity = {
    id: 2,
    name: 'Running',
    nbParticipant: 90,
    isRecommended: 1
};

const mockNonRecommendedActivity = {
    id: 3,
    name: 'Swimming',
    nbParticipant: 85,
    isRecommended: 0
};


const mockActivities = [
    {
        id: 1,
        name: 'Yoga au parc',
        url: 'http://example.com/yoga',
        telephone: '123-456-7890',
        address: '123 Park Avenue, Big City',
        latitude: '45.5017',
        longitude: '-73.5673',
        schedule: 'Lundi au Vendredi, 10h à 16h',
        language: 'Français, Anglais',
        accessibility: 'Accessible aux fauteuils roulants',
        imageName: 'yoga_parc.jpg',
        description: 'Séance de yoga matinale en plein air.',
        location: 'Parc Central',
        isRecommended: 1,
        nbParticipant: 20,
        note: 4
    }
];

beforeEach(() => {
    jest.clearAllMocks();
});

describe('listAllActivities Controller Test', () => {
    it('should return 200 and the list of activities', async () => {
        activityService.fetchAllActivities.mockResolvedValue(mockActivities);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.listAllActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ activities: mockActivities });
    });
});

describe('getActivityById Controller', () => {
    it('should return 200 and the activity data when found', async () => {
        activityService.findActivityById.mockResolvedValue([mockActivities[0]]);

        const req = { params: { activityId: '1' }};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await activityController.getActivityById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: `Activity found`, data: [mockActivities[0]]});
    });

    it('should return 404 when the activity is not found', async () => {
        activityService.findActivityById.mockResolvedValue([]);

        const req = { params: { activityId: '2' }};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await activityController.getActivityById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "Activity not found"});
    });
});

describe('saveActivity Controller', () => {
    it('should return 201 and a success message when the activity is successfully saved', async () => {
        activityService.saveActivity.mockResolvedValue([1]);

        const req = { body: mockActivities[0] };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await activityController.saveActivity(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Activity is successfully saved." });
    });
});

describe('listRecommendedActivities Controller', () => {
    it('should return 200 and a list of recommended activities', async () => {
        activityService.findRecommendedActivities.mockResolvedValue(mockActivities);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.listRecommendedActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ 'activities': mockActivities });
    });

   /*it('should return 401 and a server error message on failure', async () => {
        activityService.findRecommendedActivities.mockRejectedValueOnce(new Error('Server error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.listRecommendedActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });*/
});

describe('listPopularActivities Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and a list of popular activities', async () => {
        const mockActivities = [{ id: 1, name: 'Hiking', nbParticipant: 150 }];
        activityService.findPopularActivities.mockResolvedValue(mockActivities);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.listPopularActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ 'activities': mockActivities });
    });

    /*it('should return 500 and a server error message on failure', async () => {
        activityService.findPopularActivities.mockRejectedValue(new Error('Server error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.listPopularActivities(req, res);

        //expect(res.status).toHaveBeenCalledWith(401); // Modifier selon la gestion des erreurs appropriée
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });*/
});

describe('getTopFivePopularActivities Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and a list of top five popular activities', async () => {
        activityService.findTopFivePopularActivities.mockResolvedValue(mockTopFivePopularActivities);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.getTopFivePopularActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ 'activities': mockTopFivePopularActivities });
    });

    /*it('should return 401 and a server error message on failure', async () => {
        activityService.findTopFivePopularActivities.mockRejectedValue(new Error('Server error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.getTopFivePopularActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });*/
});


describe('getTopFiveRecommendedActivities Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and a list of top five recommended activities', async () => {
        activityService.findTopFiveRecommendedActivities.mockResolvedValue(mockTopFiveRecommendedActivities);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.getTopFiveRecommendedActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ "activities": mockTopFiveRecommendedActivities });
    });

    /*it('should return 401 and a server error message on failure', async () => {
        activityService.findTopFiveRecommendedActivities.mockRejectedValue(new Error('Server error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.getTopFiveRecommendedActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });*/
});


describe('getRecommendedActivityById Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and the activity data when found and recommended', async () => {
        activityService.findRecommendedActivityById.mockResolvedValue([mockRecommendedActivity]);

        const req = { params: { activityId: '2' }};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.getRecommendedActivityById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: `Activity found`, activity: mockRecommendedActivity});
    });

    it('should return 403 if the activity is not recommended', async () => {
        activityService.findRecommendedActivityById.mockResolvedValue([mockNonRecommendedActivity]);

        const req = { params: { activityId: '3' }};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.getRecommendedActivityById(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({message: "Activity not recommended"});
    });

    /*it('should return 404 and a server error message if the activity is not found', async () => {
        activityService.findRecommendedActivityById.mockRejectedValue(new Error('Activity not found'));

        const req = { params: { activityId: 'unknown' }};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.getRecommendedActivityById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Activity not found" });
    });*/
});

describe('updateNoteActivity Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and a success message when the note is updated successfully', async () => {
        const activityId = 1;
        const newNote = 4;
        const req = { params: { activityId }, body: { note: newNote } };

        activityService.updateActivityNote.mockResolvedValue(1); 

        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await activityController.updateNoteActivity(req, res);

        expect(activityService.updateActivityNote).toHaveBeenCalledWith(activityId, newNote);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Activity note is updated successfully" });
    });

    /*it('should return 401 and an error message when the activity is not found', async () => {
        const activityId = 1;
        const newNote = 4;
        const req = { params: { activityId }, body: { note: newNote } };

        // Mock de la fonction de service pour simuler l'absence de mise à jour
        activityService.updateActivityNote.mockResolvedValue(0); 

        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        await activityController.updateNoteActivity(req, res);

        // Vérification que la fonction de service est appelée avec les bons arguments
        expect(activityService.updateActivityNote).toHaveBeenCalledWith(activityId, newNote);
        // Vérification du statut de la réponse
        expect(res.status).toHaveBeenCalledWith(401);
        // Vérification du message d'erreur dans la réponse JSON
        expect(res.json).toHaveBeenCalledWith({ message: "Activity not found" });
    });*/
});



describe('getAllActivitiesByUserPosition Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and a list of nearby activities when found', async () => {
        const mockUserLat = 45.5017;
        const mockUserLon = -73.5673;

        const mockNearbyActivities = [
            { id: 1, name: 'Activity 1', latitude: 45.5017, longitude: -73.5673 },
            { id: 2, name: 'Activity 2', latitude: 45.5016, longitude: -73.5674 }
        ];

        activityService.getAllActivitiesByUserPosition.mockResolvedValue(mockNearbyActivities);

        const req = { query: { lat: mockUserLat, lon: mockUserLon } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.getAllActivitiesByUserPosition(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Nearby activities found", activities: mockNearbyActivities });
    });

    it('should return 404 when no nearby activities are found', async () => {
        const mockUserLat = 45.5017;
        const mockUserLon = -73.5673;

        activityService.getAllActivitiesByUserPosition.mockResolvedValue([]);

        const req = { query: { lat: mockUserLat, lon: mockUserLon } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.getAllActivitiesByUserPosition(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "No nearby activities found" });
    });

    it('should return 404 when an error occurs during fetching activities', async () => {
        const mockUserLat = 45.5017;
        const mockUserLon = -73.5673;

        activityService.getAllActivitiesByUserPosition.mockRejectedValue(new Error('Database error'));

        const req = { query: { lat: mockUserLat, lon: mockUserLon } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityController.getAllActivitiesByUserPosition(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Activity not found" });
    });
});
