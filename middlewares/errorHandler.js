const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(error);

  // Object id cast error
  if (error.kind === "ObjectId") {
    error = new ErrorResponse(`No such shop with id of ${error.value}`, 404);
  }

  // Duplicate key error
  if (error.code === 11000) {
    error = new ErrorResponse(
      `Shop name ${error.keyValue.name} already exists`,
      404
    );
  }

  // Validator errors
  if (error.errors) {
    error = new ErrorResponse(
      Object.values(error.errors)
        .map((err) => err.properties.message)
        .join(" "),
      400
    );
  }

  res.status(error.statusCode).json({ success: false, error: error.message });
};

module.exports = errorHandler;
