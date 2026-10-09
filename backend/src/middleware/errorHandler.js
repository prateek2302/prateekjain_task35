export const notFound = (_req, res) => {
  res.status(404).json({ message: "Route not found." });
};

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }

  if (error.name === "ValidationError") {
    const errors = Object.fromEntries(
      Object.entries(error.errors).map(([field, issue]) => [field, issue.message])
    );
    return res.status(400).json({ message: "Please correct the submitted values.", errors });
  }

  console.error(error);
  return res.status(500).json({ message: "An unexpected server error occurred." });
};
