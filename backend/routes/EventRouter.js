const express = require('express')
const { createEvent,
        eventsRegistration,
        searchEvents,
        getRegisteredEvent,
        getAllEvent} = require('../controller/EventController')
const authorizedRoles = require('../middlewares/roleAuthenticator')

const router = express.Router();

router.post("/createEvent", authorizedRoles("admin", "dev"), createEvent)

router.post("/joinEvent", eventsRegistration)

router.get("/search", searchEvents)

router.get("/getEvent", getRegisteredEvent)

router.get("/getAllEvents", getAllEvent)

module.exports = router;