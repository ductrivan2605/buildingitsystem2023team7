const express = require('express');
const router = express.Router();



router.get("/aboutUs", async (req, res) => {
  try {
      res.render("user/aboutUs", {
          layout: "./layouts/user/feedbackLayout",
          title: "About Us",
      });
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
  }
});

router.get("/privacyPolicy", async (req, res) => {
    try {
        res.render("user/privacyPolicy", {
            layout: "./layouts/user/feedbackLayout",
            title: "Privacy and Policy",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
  });


  router.get("/copyright", async (req, res) => {
    try {
        res.render("user/copyright", {
            layout: "./layouts/user/feedbackLayout",
            title: "Copyright",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
  });



module.exports = router;