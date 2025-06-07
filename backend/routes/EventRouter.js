const express = require('express')
const { createEvent,
        eventsRegistration,
        searchEvents,
        getEvent } = require('../controller/EventController')
const authorizedRoles = require('../middlewares/roleAuthenticator')

const router = express.Router();

router.post("/createEvent", authorizedRoles("admin", "dev"), createEvent)

router.post("/joinEvent", eventsRegistration)

router.get("/search", searchEvents)

router.get("/getEvent", getEvent)

module.exports = router;