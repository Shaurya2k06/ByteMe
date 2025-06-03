const express = require('express')
const { createEvent,
        eventsRegistration,
        searchEvents } = require('../controller/EventController')


const router = express.Router();

router.post("/createEvent", createEvent)

router.post("/joinEvent", eventsRegistration)

router.get("/search", searchEvents)

module.exports = router;