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
        const now = new Date();
        const investmentDate = new Date(investment.investmentDate);
        const lastUpdate = investment.lastProfitUpdate || investmentDate;

        // Debugging: Log details of each investment
        console.log(`User: ${user._id}, Investment: ${investment._id}`);
        console.log(`Now: ${now}, Investment Date: ${investmentDate}, Last Update: ${lastUpdate}`);

        const oneDayInMs = 24 * 60 * 60 * 1000;
        const todayAt5PM = new Date(now);
        todayAt5PM.setHours(17, 0, 0, 0); // Set time to 5 PM today

        // Check if the investment needs its first profit update at 5 PM
        const isFirstUpdate = !investment.lastProfitUpdate;
        const isToday = investmentDate.toDateString() === now.toDateString();
        if (isFirstUpdate && isToday && now >= todayAt5PM) {
          const plan = investment.planId;

          if (!plan || !plan.monthlyReturn) {
            console.log(`Skipping update for investment ${investment._id}: Missing or invalid plan details.`);
            return; // Skip if plan data is missing
          }

          const dailyProfit = calculateDailyProfit(investment.amount, plan.monthlyReturn);

          console.log(`First profit update for investment ${investment._id}: { amount: ${investment.amount}, dailyProfit: ${dailyProfit.toFixed(2)} }`);

          investment.totalProfit = (investment.totalProfit || 0) + dailyProfit; // Update total profit
          investment.lastProfitUpdate = now; // Set the last update to now
          userModified = true; // Mark the user as modified
        }
        // Standard update logic for subsequent updates
        else if (now - new Date(lastUpdate) >= oneDayInMs) {
          const plan = investment.planId;

          if (!plan || !plan.monthlyReturn) {
            console.log(`Skipping update for investment ${investment._id}: Missing or invalid plan details.`);
            return; // Skip if plan data is missing
          }

          const dailyProfit = calculateDailyProfit(investment.amount, plan.monthlyReturn);

          if (dailyProfit > 0) {
            console.log(`Updating investment for user ${user._id}: { amount: ${investment.amount}, dailyProfit: ${dailyProfit.toFixed(2)} }`);

            investment.totalProfit = (investment.totalProfit || 0) + dailyProfit; // Update total profit
            investment.lastProfitUpdate = now; // Update last update time
            userModified = true; // Mark the user as modified
          }
        } else {
          console.log(`No update needed for investment ${investment._id}.`);
        }
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
cron.schedule('0 17 * * *', updateDailyProfits, {
  timezone: 'Asia/Kolkata', // Replace with your timezone
});

module.exports = { updateDailyProfits };
