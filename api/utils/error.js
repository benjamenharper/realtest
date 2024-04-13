export const errorHandler = (statusCode, message) => {
  // Create a new Error object
  const error = new Error();
  // Set the status code and message of the error object
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
