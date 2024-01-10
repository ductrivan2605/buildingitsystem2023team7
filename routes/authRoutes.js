const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const upload = require("../middleware/uploadImage");

router.get("/signin",connectEnsureLogin.ensureLoggedOut(), async (req, res) => {
  try {
    res.render("signin", {
      layout: false,
      title: "User Authenticate",
    });
  } catch (error) {
    res.send(error);
  }
});

router.get("/register", async (req, res) => {
  try {
    res.render("register", {
      layout: false,
      title: "User Authenticate",
    });
  } catch (error) {
    res.send(error);
  }
});

router.get("/configure", async (req, res) => {
  try {
    res.render("configure", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "User Authenticate",
    });
  } catch (error) {
    res.send(error);
    res.render("404")
  }
});
router.post('/register', upload.single('image'), async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const existingUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

    if (existingUser) {
      // Send a window alert indicating that the username or email is already in use
      if (req.file) {
        const newImageFilePath = path.join(__dirname, '../../public', 'images', req.file.filename);
        try {
          await fs.unlink(newImageFilePath);
        } catch (error) {
          console.error(`Error deleting new image: ${error.message}`);
        }
      }

      // Send a window alert indicating the email is not unique
      return res.send('<script>alert("Email is already in use"); window.location="/auth/register";</script>');
    }

    const image = req.file ? '/images/' + req.file.filename : '/images/userDefault.jpg';
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email || '',
      role: 'standard',
      image,
    });

    await user.save();
    console.log(user);
    res.redirect('/auth/signin');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});


router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});



// router.post('/signin', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });

//   if (!user) {
//     return res.status(404).send('User not found');
//   }

//   try {
//     if (await bcrypt.compare(password, user.password)) {
//       res.send(`Welcome, ${user.username}!`);
//       res.redirect("/")
//     } else {
//       res.status(401).send('Invalid password');
//     }
//   } catch (error) {
//     res.status(500).send('Error signing in');
//     res.render("404")
//   }
// });

router.post('/signin', passport.authenticate('local', {
  successReturnToOrRedirect:'/',
  failureRedirect: '/auth/signin',
  failureFlash: false, 
}), (req, res) => {
  console.log('Authentication successful');
});



// POST /auth/configure route to handle user information update
router.post('/configure', async (req, res) => {
  const { name, email, address, subaddress, country } = req.body;
  const userId = req.user._id; // Assuming user is authenticated and their ID is available in req.user

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.name = name;
    //addusername or nickname
    user.email = email;
    user.address = address; //we don't need
    user.subaddress = subaddress; //we don't need
    user.country = country; //we don't need

    await user.save();
    res.redirect('/configure'); // Redirect to profile viewing page
  } catch (error) {
    res.status(500).send('Error updating user information');
    res.render("404")
  }
});

module.exports = router;
