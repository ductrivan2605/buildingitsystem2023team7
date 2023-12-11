const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userName:{
        type: String, 
        required: true,
    },
    review: String,
    createAt:{
        type: Date,
        default: Date.now,
        immutable: true,
    }
});
reviewSchema.methods.getFormattedDateTime = function() {
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    // Check if createdAt field is defined
    if (this.createdAt) {
      const formattedDate = this.createdAt.toLocaleDateString('en-GB', dateOptions);
      const formattedTime = this.createdAt.toLocaleTimeString('en-US', timeOptions);
      return `${formattedDate}\n ${formattedTime}`;
    } else {
      return '';
    }
  };

const Reviews = mongoose.model('Reviews', reviewSchema);

module.exports = Reviews;