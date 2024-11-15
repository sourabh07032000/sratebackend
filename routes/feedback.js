const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.status(200).json({
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    res.status(200).json({
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    const newplan = await feedback.save();

    res.status(200).json({
      data: newplan,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});



router.put("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(400).json({ message: "Feedback does not exist" });
    }
    feedback.planName = req.body.planName || feedback.planName;
    feedback.planStartAmount = req.body.planStartAmount || feedback.planStartAmount;
    feedback.planEndAmount = req.body.planEndAmount || feedback.planEndAmount;
    feedback.monthlyReturn = req.body.monthlyReturn || feedback.monthlyReturn;
    feedback.annualReturn = req.body.annualReturn || feedback.annualReturn;
    
  
    const updatedPlan = await feedback.save();

    res.status(200).json({
      data: updatedPlan,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Feedback is deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
