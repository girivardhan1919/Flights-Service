const express = require('express');
const { FlightController } = require('../../controllers');
const { FlightMiddlwares } = require('../../middlewares');

const router = express.Router();

router.post('/', FlightMiddlwares.validateCreateRequest, FlightController.createFlight);

router.get('/',FlightController.getAllFlights);

module.exports = router;