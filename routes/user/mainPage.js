const express = require("express");
const router = express.Router();
const Categories = require("../../models/Category.js");
const Books = require("../../models/bookModel.js");
const Reviews = require("../../models/review.js");


router.get("/", async(req,res) =>{
    try{
        const categories = await Categories.find({}).limit(5);
        const books = await Books.find({});
        res.render('user/categoryNavigation' , {
            layout: './layouts/user/mainPage', 
            categories: categories,
            books: books,
            title: "Booktopia"
        });
    }
    catch(error){
        console.log(error);
    }
})

router.get("/book/:slug", async (req, res) => {
    try{
        const books = await Books.findOne({slug: req.params.slug});
        res.render('user/bookDetail', {layout: './layouts/user/bookDetailPage', title:"Booktopia", books: books})
    }catch(error){
        console.log(error);
    }
})

router.get("/book/:slug/comments", async (req, res) => {
    
})


module.exports = router;
