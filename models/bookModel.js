const mongoose = require('mongoose');
const { memoryStorage } = require('multer');

const BookSchema = new mongoose.Schema({
   title:{
    type:String,
    required: true
   }, 
   author:[
      {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Authors',
       required: true
      },
   ],
   category:[
      {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Categories',
       required: true,
      },
   ],
   published: {
    type: String,
   },
   rating:{
    type:Number,
   },
   description: {
    type: String,
   },
   
    review:{
        type: String,
   },
   
   image: {
    type: String,
    required: true
   },


});


const Books = mongoose.model('Book Detial', BookSchema);

module.exports = Books;