const catchFunc = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next());
  };
};

module.exports = catchFunc;
