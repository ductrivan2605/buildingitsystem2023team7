// adminRouter.js
const express = require('express');
const router = express.Router();

// Define /admin route
router.get('/', (req, res) => {
    // Admin route logic
});

// Define /admin/auth/logout route
router.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error logging out');
        }
        res.redirect('/');
      });
});

module.exports = router;
