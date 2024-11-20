const express = require('express');
const router = express.Router();
const { updateDailyProfits } = require('./cronJobs'); // Adjust the path to your cron job file

// Route to manually trigger the updateDailyProfits function
router.get('/test-update-profits', async (req, res) => {
  try {
    await updateDailyProfits();
    res.status(200).json({ success: true, message: 'Daily profits updated successfully.' });
  } catch (error) {
    console.error('Error in test-update-profits route:', error);
    res.status(500).json({ success: false, message: 'Error updating daily profits.', error });
  }
});

module.exports = router;
