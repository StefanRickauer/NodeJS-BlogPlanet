// Export zur Verwendung in anderen Modulen

exports.getNotFound = (req, res) => {
  res.status(404).render("notFound");
};
