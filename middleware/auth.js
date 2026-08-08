// Middleware to require login for protected routes
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/auth/login"); // not logged in -> go log in
  }
  next(); // logged in -> continue to the page
}

// Middleware to require admin role for admin routes
function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/auth/login"); // not logged in at all
  }
  if (req.session.role !== "admin") {
    return res.status(403).send("Access denied - admins only."); // logged in, but not admin
  }
  next(); // logged in AND admin -> continue
}

// Export the functions so they can be used in other files.
module.exports = {
  requireLogin,
  requireAdmin,
};
