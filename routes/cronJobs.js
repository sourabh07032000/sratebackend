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
        const plan = investment.planId;

        // Check if the plan details are valid
        if (!plan || !plan.monthlyReturn) {
          console.log(`Skipping update for investment ${investment._id}: Missing or invalid plan details.`);
          return; // Skip if plan data is missing
        }

        // Calculate daily profit
        const dailyProfit = calculateDailyProfit(investment.amount, plan.monthlyReturn);

        console.log(`Updating investment for user ${user._id}: { amount: ${investment.amount}, dailyProfit: ${dailyProfit.toFixed(2)} }`);

        // Update total profit
        investment.totalProfit = (investment.totalProfit || 0) + dailyProfit;
        investment.lastProfitUpdate = new Date(); // Update last profit update time
        userModified = true; // Mark the user as modified
      });

      if (userModified) {
        // Ensure investments array is marked as modified
        user.markModified('investments');

        // Save updated user data if modified
        try {
          await user.save();
          console.log(`Updated daily profits for user: ${user._id}`);
        } catch (error) {
          console.error(`Error saving user ${user._id}:`, error);
        }
      } else {
        console.log(`No updates required for user: ${user._id}`);
      }
    }

    console.log('Daily profits updated successfully.');
  } catch (error) {
    console.error('Error updating daily profits:', error);
  }
};

// Calculate daily profit with rounding to 2 decimal places
const calculateDailyProfit = (amount, monthlyROI) => {
  const dailyROI = monthlyROI / 30; // Approximate daily ROI
  return parseFloat((amount * dailyROI / 100).toFixed(2)); // Calculate daily profit and round to 2 decimals
};

// Schedule the cron job to run at 5 PM every day with timezone handling
cron.schedule('0 18 * * *', updateDailyProfits, {
  timezone: 'Asia/Kolkata', // Replace with your timezone
});

module.exports = { updateDailyProfits };

