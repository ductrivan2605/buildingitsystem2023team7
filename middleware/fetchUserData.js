const User = require("../models/user");

const fetchUserData = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const user = await User.findById(req.user._id);
      res.locals.user = {
        name: user.name,
        image: user.image,
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