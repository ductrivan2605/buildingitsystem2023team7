const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category: {
        type: String, 
        required: true
    },
    subCategory: [
        {
            type: String, 
        }
    ],
    image:{
        type: String,
      } 
});


const Category = mongoose.model('Categories', CategorySchema);

module.exports = Category;