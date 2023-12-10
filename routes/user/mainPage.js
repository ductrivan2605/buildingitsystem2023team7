const express = require("express");
const router = express.Router();
const Categories = require("../../models/Category.js");
const Books = require("../../models/bookModel.js");

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




module.exports = router;
