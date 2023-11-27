const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");



// Static Files
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));


// SetUp parse
app.use(express.urlencoded({ extended: true }));


// Mongoose



app.listen(3000, ()=>{
    console.log(`Server is running on port localhost:3000`);
});
  