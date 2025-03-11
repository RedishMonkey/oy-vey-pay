const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    tag:{
        type: String,
        required: true,
        enum:['food',
            'rent',
            'transport',
            'entertainment',
            'clothing',
            'health',
            'education',
            'other',],
    },
    currency: {
        type: String,
        required: true,
        default: 'USD',
        enum: ['ILS','USD','EUR'],
    },
    exchangedAmount : {
        type: Number,
        default: '0',
    },
    
    },{timestamps: true,});


module.exports = mongoose.model('Expense',expenseSchema);