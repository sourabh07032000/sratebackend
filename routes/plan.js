const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");

router.get("/", async (req, res) => {
  try {
    const plan = await Plan.find();
    res.status(200).json({
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    res.status(200).json({
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const plan = new Plan(req.body);
    const newplan = await plan.save();

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
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(400).json({ message: "Plan does not exist" });
    }
    plan.planName = req.body.planName || plan.planName;
    plan.planStartAmount = req.body.planStartAmount || plan.planStartAmount;
    plan.planEndAmount = req.body.planEndAmount || plan.planEndAmount;
    plan.monthlyReturn = req.body.monthlyReturn || plan.monthlyReturn;
    plan.annualReturn = req.body.annualReturn || plan.annualReturn;
    
  
    const updatedPlan = await plan.save();

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
    await Plan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Plan is deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
