const User = require("../models/user");

const fetchUserData = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const user = await User.findById(req.user._id).populate("bookmarks");
      res.locals.user = {
        name: user.name,
        image: user.image,
        role: user.role,
        bookmarks: user.bookmarks,  // Include bookmarks data
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    res.locals.user = null;
  }

  next();
};

module.exports = fetchUserData;
