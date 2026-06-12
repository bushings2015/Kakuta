const adminMiddleware = async (req, res, next) => {
  const user = req.user;

  if (user && user.role === "ADMIN") {
    return next();
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized: Must be admin role only" });
  }
};

module.exports = adminMiddleware;
