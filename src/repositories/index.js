const FlightRepository = require('./flight-repository');

module.exports = {
  AirplaneRepository: require('../repositories/airplane-repository'),
  CityRepository: require('../repositories/city-repository'),
  AirportRepository: require('../repositories/airport-repository'),
  FlightRepository: require('../repositories/flight-repository'),
}