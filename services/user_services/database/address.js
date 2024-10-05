const AddressModel = require("../models/address");

class Address {
  static async addAddress(address) {
    return await new AddressModel({
      ...address,
    }).save();
  }
}

module.exports = Address;
