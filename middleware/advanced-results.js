// const foo = () => () => {} : shorthand to putting a function inside a function
const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query }; // Copy req.query
  const removeFields = ["select", "sort", "page", "limit"]; // Fields to exclude
  removeFields.forEach((param) => delete reqQuery[param]); // Loop over removeFields and delete them from reqQuery

  let queryString = JSON.stringify(reqQuery); // Create query string
  queryString = queryString.replace(/\b(lt|lte|gt|gte|in)\b/g, (match) => "$" + match); // Create operators ($gt, $gte, etc)

  query = model.find(JSON.parse(queryString)); // Finding resources

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // Sort by
  if (req.query.sort) {
    const sortBy = req.query.select.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  if (populate) query = query.populate(populate);

  const results = await query; // Executing query

  // Pagination result
  const pagination = {};
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };
  if (endIndex < total) pagination.next = { page: page + 1, limit };

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
