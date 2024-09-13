const { Airport } = require('../models');
const CrudRepository = require('../repositories/crud-repository');


class AirportRepository extends CrudRepository {
  constructor() {
    super(Airport);
  }
}

module.exports = AirportRepository;