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


// Books Database
mongoose
  .connect(
    "mongodb+srv://thegalaxy1590:thegalaxy1590@librarybooks.pouktuc.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((error) => console.log(error.message));

// Routes
const mainPage = require("./routes/user/mainPage");
const bookDetailRouter = require("./routes/user/bookDetail");
const authorRouter = require("./routes/user/aboutAuthor");
const categoryRouter= require("./routes/user/categoryPage");
const CategoryRouter = require("./routes/admin/categoryRoute");
const AuthorRouter = require("./routes/admin/authorRoute");
const BooksRouter = require("./routes/admin/bookManagementRoute");
const authRouter = require("./routes/authRoutes");
const userManagementRouter = require("./routes/admin/userManagementRoute");
const userRouter = require("./routes/user/userRoutes");
const wishlistRouter = require("./routes/wishlistRouter");
const wishlistAdminRouter = require('./routes/admin/wishlistAdminRouter');

app.use("/", mainPage);
app.use("/book", bookDetailRouter);
app.use("/author", authorRouter);
app.use("/category", categoryRouter);
app.use("/admin/categories", CategoryRouter);
app.use("/admin/authors", AuthorRouter);
app.use("/admin/books-management", BooksRouter);
app.use("/admin/users-management", userManagementRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/wishlist", wishlistRouter);
app.use('/admin/wishlist', wishlistAdminRouter);

// app.get('/', (req, res) => {
//   res.render('user/wishlist');
// });


app.listen(3000, () => {
  console.log(`Server is running on port localhost:3000`);

});


