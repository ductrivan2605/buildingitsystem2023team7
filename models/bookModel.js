const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
   title:{
    type:String,
    required: true
   }, 
   authors: [
      {
        type: String,
        required: true
      }
    ],
   category:[
      {
       type: String,
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
   contentImage: [{
    type: String,
    required: true
   }],
   imageCover:{
      type: String,
      required: true
   }
});


const Books = mongoose.model('Book details', BookSchema);

module.exports = Books;