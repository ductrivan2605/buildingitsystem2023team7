const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    background:{
        type:String, 
    },
    image: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    }
});

authorSchema.pre('validate', function (next) {
    if(this.name){
        this.slug = slugify(this.name, {lower:true, strict:true});
    }
    next();
});


const Author = mongoose.model('Authors', authorSchema);

module.exports = Author;