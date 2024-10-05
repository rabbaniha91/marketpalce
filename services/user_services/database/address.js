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

  static async editAddress(id, address) {
    return await AddressModel.findByIdAndUpdate({ _id: id }, { ...address }, { new: true });
  }

  static async deleteAddress(id) {
    return await AddressModel.findByIdAndDelete(id);
  }
}

module.exports = Address;
