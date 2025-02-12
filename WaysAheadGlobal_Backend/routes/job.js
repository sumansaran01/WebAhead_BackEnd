const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const Job = require("../Models/Job"); // Job model
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware"); // Import middleware
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure that the 'uploads' folder exists
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

router.get("/jobs", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json({ success: true, jobs });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/jobs", async (req, res) => {
    try {
        const { title, description, category, location, openings, experience, salary } = req.body;
        const newJob = new Job({
            title,
            category,
            description,
            location,
            experience,
            openings,
            salary,
        });
        await newJob.save();
        res.json({ success: true, message: "Job added successfully!" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/jobs/apply",  upload.single("resume"), async (req, res) => {
    try {
        const { jobId, email, name } = req.body;
        const resumePath = req.file ? req.file.path : null;

        if (!resumePath) {
            return res.status(400).json({ error: "Resume is required" });
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        
        job.applicants.push({name, email, resume: resumePath });
        await job.save();
        
        res.json({ success: true, message: "Application submitted successfully!" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
