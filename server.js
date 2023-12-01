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
    // Books Database
        mongoose.connect('mongodb+srv://thegalaxy1590:thegalaxy1590@librarybooks.pouktuc.mongodb.net/?retryWrites=true&w=majority')
        .then(() => console.log("Connected to MongoDB Atlas!"))
        .catch((error) => console.log(error.message));

// Routes
const CategoryRouter = require('./routes/admin/categoryRoute');
const AuthorRouter = require('./routes/admin/authorRoute');
const BooksRouter = require('./routes/admin/bookRoute');
const authRouter = require('./routes/authRoutes');

app.use("/admin/category/", CategoryRouter);
app.use("/admin/author/", AuthorRouter);
app.use("/admin/books-management/", BooksRouter);
app.use("/auth", authRouter);

app.listen(3000, ()=>{
    console.log(`Server is running on port localhost:3000`);
});
  