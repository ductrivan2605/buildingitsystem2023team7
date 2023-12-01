const mongoose = require('mongoose');

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
   
   image: {
    type: String,
    required: true
   },


});


const Books = mongoose.model('Book details', BookSchema);

module.exports = Books;