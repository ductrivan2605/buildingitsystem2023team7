const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");


// Page Template Engine
app.use(expressLayouts);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


// SetUp parse
app.use(express.urlencoded({ extended: true }));

// Mongoose

// Books Database
mongoose
  .connect(
    "mongodb+srv://thegalaxy1590:thegalaxy1590@librarybooks.pouktuc.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((error) => console.log(error.message));

// Routes
const mainPage = require("./routes/user/mainPage");
const CategoryRouter = require("./routes/admin/categoryRoute");
const AuthorRouter = require("./routes/admin/authorRoute");
const BooksRouter = require("./routes/admin/bookManagementRoute");
const authRouter = require("./routes/authRoutes");
const wishlistRouter = require("./routes/wishlistRouter");

app.use("/", mainPage);
app.use("/admin/categories", CategoryRouter);
app.use("/admin/authors", AuthorRouter);
app.use("/admin/books-management", BooksRouter);
app.use("/auth", authRouter);
app.use("/wishlist", wishlistRouter);


app.listen(3000, () => {
  console.log(`Server is running on port localhost:3000`);

});


