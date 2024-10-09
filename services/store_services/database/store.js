const StoreModel = require("../models/store");
const crypto = require("crypto");

class Store {
  // create a new store
  static async addStore(store) {
    return await new StoreModel({
      ...store,
    }).save();
  }
  // search for stores based on title
  static async getStoresWithSearch(query) {
    const regex = new RegExp(query, "ig");
    return await StoreModel.find({ title: regex }, "title logo category averageRating").exec();
  }
  // search for stores based on category
  static async getStoresWithCategory(category, skip) {
    return await StoreModel.find(
      {
        category,
      },
      "title logo category averageRating",
      { skip }
    ).exec();
  }
  // find the store with id
  static async getStoreById(id) {
    return await StoreModel.findById(id);
  }
  // get all stores created by the user
  static async getUserStores(userId) {
    return await StoreModel.find({ createdBy: userId });
  }
  // inactivate store
  static async changeVisibility(id) {
    return await StoreModel.findOneAndUpdate({ _id: id }, { visibility: !visibility }, { new: true });
  }
  // get stores followers
  static async getStoreFollowers(id) {
    return await StoreModel.findById(id).populate({
      path: "followers",
      select: "firstname lastname profilePicture",
    });
  }
  // update stores title
  static async changeTitle(id, title) {
    return await StoreModel.findOneAndUpdate({ _id: id }, { title }, { new: true });
  }
  // update stores logo
  static async changeLogo(id, logo) {
    return await StoreModel.findOneAndUpdate({ _id: id }, { logo }, { new: true });
  }
  // update stores banner
  static async changeBanner(id, banner) {
    return await StoreModel.findOneAndUpdate({ _id: id }, { banner }, { new: true });
  }
  // update stores description
  static async changeDescription(id, description) {
    return await StoreModel.findOneAndUpdate({ _id: id }, { description }, { new: true });
  }
  // add video to store
  static async addVideo(id, video, title) {
    return await StoreModel.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          videos: {
            id: crypto.randomUUID,
            url: video,
            title,
          },
        },
      },
      { new: true }
    ).select("videos");
  }
  // remove video from stores
  static async removeVideo(id, videoId) {
    return await StoreModel.updateOne({ _id: id }, { $pull: { videos: { id: videoId } } });
  }

  static async rateToStore(rate, userId, storeId) {
    return await StoreModel.findOneAndUpdate(
      {
        _id: storeId,
      },
      {
        $push: {
          ratings: { user: userId, rate },
        },
      },
      { new: true }
    );
  }
}

module.exports = Store;
