const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize'); 
const { FlightRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { compareTime } = require('../utils/helpers/datetime-helper');
const flightRepository = new FlightRepository();

async function createFlight(data) {
  try {
    if (!compareTime(data.arrivalTime, data.departureTime)) {
      throw new AppError('DepartureTime should be less than ArrivalTime', StatusCodes.BAD_REQUEST);
    }
    const flight = await flightRepository.create(data);
    return flight;
  } catch (error) {
    // console.log(error);
    if (error.name == "SequelizeValidationError") {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    if (error instanceof AppError) {
      throw error; // Re-throwing the AppError so it can be handled elsewhere (e.g., by the controller)
    }

    throw new AppError('Cannot create a new Flght object', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getAllFlights(query) {
    let customFilter = {};
    let sortFilter = [];
    const endingTripTime = " 23:59:00";
    //trips=MUM-DEL
    if(query.trips){
      [departureAirportId,arrivalAirportId] = query.trips.split('-');
      customFilter.departureAirportId = departureAirportId;
      customFilter.arrivalAirportId = arrivalAirportId;
    }
    if(query.price){
      [minPrice, maxPrice] = query.price.split('-');
      customFilter.price = {
        [Op.between]: [minPrice, maxPrice]
      }
    }
    if(query.travellers){
      customFilter.totalSeats = {
        [Op.gte]: query.travellers
      }
    }
    if(query.tripDate){
      customFilter.departureTime = {
        [Op.gte]:[query.tripDate, query.tripDate + endingTripTime]
      }
    }
    if(query.sort){
      const params = query.sort.split(',');
      const sortFilters = params.map((param)  => param.split('_'));
      sortFilter = sortFilters;
    }
    console.log(customFilter,sortFilter);
    try {
      const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
      return flights;
    } catch (error) {
      console.log(error);
      throw new AppError('Cannot fetch data of all flights', StatusCodes.INTERNAL_SERVER_ERROR);
    }

}

module.exports = { createFlight, getAllFlights };