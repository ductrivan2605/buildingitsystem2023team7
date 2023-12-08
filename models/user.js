const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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

module.exports = mongoose.model('User', userSchema);
