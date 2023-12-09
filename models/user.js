const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profileImage: {
    type: String,
  },
  name: {
    type: String, 
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email:{
    type: String,
    require: true
  },
  address: {
    type: String,
    required:true
  },
  subaddress: {
    type: String,
  },
  country:{
    type: String,
  },
  role: {
    type: String,
    enum: ['standard', 'admin'],
    default: 'standard'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
