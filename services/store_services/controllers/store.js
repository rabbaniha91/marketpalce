const Store = require("../database/store");
const catchFunc = require("../../../configs/catchFunc");
const AppError = require("../../../configs/AppError");
class StoreController {
  static fetchStoresByCategory = catchFunc(async (req, res, next) => {
    try {
      const { category, cursor, limit = 10 } = req.query;

      if (!category) return next(new AppError("Category not selected", 400));

      const query = {};

      if (cursor) {
        query._id = { $gt: cursor };
      }

      query.category = category;
      const stores = await Store.getStoresWithCategory(query, Number(limit));

      if (!stores) return next(new AppError(`No store has been registered with category ${category}`, 304));

      const prevCursor = cursor && stores.length > 0 ? stores[0]._id : null;
      const nextCursor = stores.length > 0 ? stores[stores.length - 1]._id : null;

      res.json({
        message: "Success",
        stores,
        prevCursor,
        nextCursor,
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  });
}

module.exports = StoreController;
