const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

// Specify view engine
app.set('view engine', 'ejs');

// Static Files
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// SetUp parse
app.use(express.urlencoded({ extended: true }));

// Mongoose
mongoose.connect('mongodb+srv://thegalaxy1590:thegalaxy1590@librarybooks.pouktuc.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas!"))
    .catch((error) => console.log(error.message));

// Routes
const CategoryRouter = require('./routes/admin/categoryRoute');
const AuthorRouter = require('./routes/admin/authorRoute');
const BooksRouter = require('./routes/admin/bookRoute');
const authRouter = require('./routes/authRoutes');
const wishlistRouter = require("./routes/wishlistRouter");

app.use("/admin/category", CategoryRouter);
app.use("/admin/author", AuthorRouter);
app.use("/admin/books-management", BooksRouter);
app.use("/auth", authRouter);
app.use("/wishlist", wishlistRouter);

app.get('/', (req, res) => {
    res.render('wishlist');
});


app.listen(3000, () => {
    console.log(`Server is running on port localhost:3000`);
});
