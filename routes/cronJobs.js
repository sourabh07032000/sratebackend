const cron = require('node-cron');
const Signup = require('../models/Signup');

// Function to update profits
const updateDailyProfits = async () => {
  try {
    const users = await Signup.find({ 'investments.0': { $exists: true } }); // Users with at least one investment

    for (const user of users) {
      user.investments.forEach((investment) => {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const now = new Date();

        // Check if 24 hours have passed since the last profit update
        if (now - new Date(investment.investmentDate) >= oneDayInMs) {
          const dailyProfit = calculateDailyProfit(investment.amount, investment.planId);

          // Update total profit
          investment.totalProfit = (investment.totalProfit || 0) + dailyProfit;

          // Update the last profit update date
          investment.lastProfitUpdate = now;
        }
      });

      await user.save(); // Save updated user data
    }

    console.log('Daily profits updated successfully.');
  } catch (error) {
    console.error('Error updating daily profits:', error);
  }
};

// Calculate daily profit (modify based on your plan logic)
const calculateDailyProfit = (amount, planId) => {
  const plans = {
    basic: { monthlyReturn: 5 },
    premium: { monthlyReturn: 7 },
  };

  const monthlyROI = plans[planId]?.monthlyReturn || 0;
  const dailyROI = monthlyROI / 30; // Approximate daily ROI
  return (amount * dailyROI) / 100;
};

// Schedule the cron job to run at 5 PM every day
cron.schedule('0 17 * * *', updateDailyProfits);

module.exports = { updateDailyProfits };

