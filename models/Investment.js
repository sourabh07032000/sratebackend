const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assuming you have a User model
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Plan', // Assuming you have a Plan model
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be positive'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
