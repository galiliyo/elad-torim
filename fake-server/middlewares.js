module.exports = (req, res, next) => {
  if (req.url.startsWith("/data-aggregation"))
    console.log("req.usersUrl:", req.url);
  if (req.url.startsWith("/data-aggregation")) console.log("res:", res);
  next();
};
