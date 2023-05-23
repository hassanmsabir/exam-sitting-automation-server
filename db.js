const mongoose = require('mongoose');

module.exports = ()=>{
    return mongoose.connect('mongodb+srv://admin:1234@cluster0.vtgmucg.mongodb.net/exam_seating_fyp?retryWrites=true&w=majority')
    
}