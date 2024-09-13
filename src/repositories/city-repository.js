const { City } = require('../models');
const CrudRepository = require('../repositories/crud-repository');


class CityRepository extends CrudRepository {
  constructor() {
    super(City);
  }
}

module.exports = CityRepository;