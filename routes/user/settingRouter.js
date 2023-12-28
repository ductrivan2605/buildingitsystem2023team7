const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require("../../models/user.js");
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const upload = require("../../middleware/uploadImage.js");
const {
    checkAuthenticated
} = require("../../middleware/checkAuthenticated.js");

module.exports = router;