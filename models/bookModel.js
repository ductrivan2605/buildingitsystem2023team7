const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

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
   publisher: {
    type: String,
    required: true
   },
   rating:{
    type:Number,
   },
   description: {
    type: String,
   },
   
   reviews:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews"
   }],
   contentImage: [{
    type: String,
   }],
   imageCover:{
      type: String,
      required: true
   },
   slug:{
      type: String,
      required: true,
      unique: true
   }

});
    
BookSchema.pre('validate', function (next){
   if(this.title){
      this.slug = slugify(this.title, {lower: true, strict: true});
   }
   next();
})

const Books = mongoose.model('Book details', BookSchema);

module.exports = Books;