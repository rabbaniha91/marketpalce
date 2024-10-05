const AddressModel = require("../models/address");

class Address {
  static async addAddress(address) {
    return await new AddressModel({
      ...address,
    }).save();
  }

  static async getAddressById(id) {
    return await AddressModel.findById(id);
  }
}

module.exports = Address;
