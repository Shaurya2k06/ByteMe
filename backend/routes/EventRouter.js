const express = require('express')
const { createEvent,
        eventsRegistration,
        searchEvents } = require('../controller/EventController')
const authorizedRoles = require('../middlewares/roleAuthenticator')

const router = express.Router();

router.post("/createEvent", authorizedRoles("admin", "dev"), createEvent)

router.post("/joinEvent", eventsRegistration)

router.get("/search", searchEvents)

module.exports = router;