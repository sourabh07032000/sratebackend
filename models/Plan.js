const mongoose = require('mongoose');

// Plan schema
const PlanSchema = new mongoose.Schema({
  planName : String,
  planStartAmount : Number,
  planEndAmount : Number,
  monthlyReturn : Number,
  annualReturn : Number
});

module.exports = mongoose.model('Plan', PlanSchema);
