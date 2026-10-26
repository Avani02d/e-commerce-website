export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);
  const status = error.statusCode || error.status || (error.name === "ValidationError" || error.name === "CastError" ? 400 : 500);
  res.status(status).json({ message: status === 500 ? "Internal server error" : error.message });
}
