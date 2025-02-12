const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Internship", "Graduate Role", "Experienced Professional"],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    openings: {
        type: Number,
        required: true
    },
    salary: {
        type: String, 
        required: false
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    applicants: [{ name: String, email: String, resume: String }]  
});

module.exports = mongoose.model("Job", JobSchema);
