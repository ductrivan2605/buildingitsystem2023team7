const express = require("express");
const router = express.Router();
const Books = require("../../models/bookModel.js");
const Authors = require("../../models/author.js");

router.get("/:slug", async (req, res) => {
  try {
    const author = await Authors.findOne({ slug: req.params.slug });

    if (!author) {
      // Handle case where no author is found for the given slug
      return res.status(404).send("Author not found");
    }

    res.render("user/aboutAuthor", {
      layout: "./layouts/user/bookDetailPage",
      title: "Author page",
      authors: {
        name: author.name || "Unknown Author",
        image: author.image,
        background: author.background,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

module.exports = router;
