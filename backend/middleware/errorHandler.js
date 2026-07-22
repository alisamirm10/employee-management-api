const errorHandler = (err, req, res, next) => {
  console.log(err);

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = {};

    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }

    return res.status(400).json({
      status: "error",
      errors,
    });
  }
  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    return res.status(400).json({
      status: "error",
      message: `${field} already exists`,
    });
  }

  // Default Error
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
