const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require('./middleware/passport-config')
const User = require('./models/user');
const connectEnsureLogin = require('connect-ensure-login');
const fetchUserData = require('./middleware/fetchUserData');
const flash = require("connect-flash");

// Page Template Engine
app.use(expressLayouts);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

// SetUp parse
app.use(express.urlencoded({ extended: true }));

// Setup Express Session
app.use(
  session({
    secret: "Booktopia",
    resave: false,
    saveUninitialized: false,
  })
);
// Setup passport

initializePassport(
  passport, 
  async (username) => await User.findOne({ username }),
  async (id) => await User.findById(id)
  );
app.use(passport.session());
app.use(passport.initialize());
// fetch user data 
app.use(fetchUserData);
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
const bookMarkRouter = require("./routes/user/bookMark");
const readingHistoryRouter = require("./routes/user/readingHistory");
const categoryRouter = require("./routes/user/categoryPage");
const CategoryRouter = require("./routes/admin/categoryRoute");
const AuthorRouter = require("./routes/admin/authorRoute");
const BooksRouter = require("./routes/admin/bookManagementRoute");
const BookContentsRouter = require("./routes/admin/bookContentManagementRoute");
const authRouter = require("./routes/authRoutes");
const userManagementRouter = require("./routes/admin/userManagementRoute");
const userRouter = require("./routes/user/userRoutes");
const wishlistRouter = require("./routes/wishlistRouter");
const wishlistAdminRouter = require("./routes/admin/wishlistAdminRouter");
const searchPageRouter = require("./routes/user/searchPageRoute");
const adminRouter = require('./routes/admin/adminRouter');
const userSettingRouter = require('./routes/user/userSettingRouter')
const renderingRouter = require('./routes/user/bookRendering'); 
const userReadingProgressRouter = require('./routes/admin/usersReadingProgress');
const userProfileRouter = require('./routes/user/userProfile');
const feedbackRouter = require('./routes/user/feedbackRoute');
const adminFeedbackRouter = require('./routes/admin/feedbackRoute');
const infoRouter = require('./routes/user/infoRoute');

app.use("/", mainPage);
app.use("/book", bookDetailRouter);
app.use("/author", authorRouter);
app.use("/bookmarks",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), bookMarkRouter);
app.use("/reading-history",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), readingHistoryRouter);
app.use("/category", categoryRouter);
app.use('/admin', adminRouter);
app.use("/admin/categories",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), CategoryRouter);
app.use("/admin/authors",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), AuthorRouter);
app.use("/admin/books-management",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), BooksRouter);
app.use("/admin/books-management/",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), BookContentsRouter);
app.use("/admin/users-management",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), userManagementRouter);
app.use("/admin/user-reading-progress", connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), userReadingProgressRouter);
app.use("/admin/wishlist",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), wishlistAdminRouter);
app.use("/user", userRouter);
app.use("/user/profile", userProfileRouter);
app.use("/user/setting", userSettingRouter);
app.use("/user/search", searchPageRouter);
app.use("/auth", authRouter);
app.use("/wishlist", wishlistRouter);
app.use('/api', renderingRouter);
app.use('/feedback', feedbackRouter);
app.use('/admin/feedback', adminFeedbackRouter)
app.use('/information', infoRouter)

// app.get('/', (req, res) => {
//   res.render('user/wishlist');
// });

//local host
// app.listen(3000, () => {
//   console.log(`Server is running on port localhost:3000`);
// });

//Heroku published
// app.listen(process.env.PORT || 3000, => {
//      console.log(`Server is running on port localhost:3000`);
//    });

//display consol.log
const port = process.env.PORT || 3000; 
app.listen(port, () => {
     console.log(`Server is running on port ${port}`); 
});