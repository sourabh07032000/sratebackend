const cron = require('node-cron');
const Signup = require('../models/Signup');

// Function to update profits
const updateDailyProfits = async () => {
  try {
    console.log('Cron job triggered at:', new Date());

    // Fetch users with at least one investment
    const users = await Signup.find({ 'investments.0': { $exists: true } });

    for (const user of users) {
      let userModified = false; // Flag to check if user data has changed

      user.investments.forEach((investment) => {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const now = new Date();

        // Use lastProfitUpdate or investmentDate for the check
        const lastUpdate = investment.lastProfitUpdate || investment.investmentDate;

        // Check if 24 hours have passed since the last profit update
        if (now - new Date(lastUpdate) >= oneDayInMs) {
          const dailyProfit = calculateDailyProfit(investment.amount, investment.planId);

          if (dailyProfit > 0) { // Ensure profit is calculated
            investment.totalProfit = (investment.totalProfit || 0) + dailyProfit; // Update total profit
            investment.lastProfitUpdate = now; // Update last update time
            userModified = true; // Mark the user as modified
          }
        }
      });

      if (userModified) {
        // Save updated user data if modified
        await user.save();
        console.log(`Updated daily profits for user: ${user._id}`);
      }
    }

    console.log('Daily profits updated successfully.');
  } catch (error) {
    console.error('Error updating daily profits:', error);
  }
};


// Calculate daily profit (modify based on your plan logic)
const calculateDailyProfit = (amount, planId) => {
  const plans = {
    basic: { monthlyReturn: 5 }, // 5% monthly return
    premium: { monthlyReturn: 7 }, // 7% monthly return
  };

  const monthlyROI = plans[planId]?.monthlyReturn || 0;
  const dailyROI = monthlyROI / 30; // Approximate daily ROI
  return (amount * dailyROI) / 100;
};

// Schedule the cron job to run at 5 PM every day with timezone handling
cron.schedule('0 17 * * *', updateDailyProfits, {
  timezone: 'Asia/Kolkata', // Replace with your timezone
});

module.exports = { updateDailyProfits };
