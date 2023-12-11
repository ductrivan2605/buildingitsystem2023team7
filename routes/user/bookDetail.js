const express = require("express");
const router = express.Router();
const Books = require("../../models/bookModel.js");
const Reviews = require("../../models/review.js");


router.get("/:slug", async (req, res) => {
    try{
        const books = await Books.findOne({slug: req.params.slug}).populate('reviews').exec();
        res.render('user/bookDetail', {layout: './layouts/user/bookDetailPage', title:"Booktopia", books: books})
    }catch(error){
        console.log(error);
    }
})

router.post("/:slug/comments", async (req, res) => {
    try{
        
        const {userName , review} = req.body;
        
        const slug = req.params.slug;
        await Reviews.create({
            userName,
            review,
        })

        res.redirect(`/book/${slug}`);
    }catch(error){
        console.log(error);
    }
        
})


module.exports = router;
