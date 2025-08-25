const { main } = require("../config/gemini");
const { connection } = require("../config/dbConnect.js");

const getAllJobs = async (req, res) => {
    try {
        connection.query("SELECT * FROM Companies", (error, results) => {
            if (error) {
                console.error("Error fetching jobs:", error);
                return res.status(500).json({ error: "Failed to fetch jobs" });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await jobService.getJobById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const postJob = async (req, res) => {
    try {
        const { joblink } = req.body;
        const result = await main(joblink);
        const { companyName, description, salary, jobType, companyType, location, eligibility, deadline, applicationLink, rounds } = result;
        const LogoUrl = `https://logo.clearbit.com/${companyName.replace(/\s+/g, '').toLowerCase()}.com`;
        connection.query(
            "INSERT INTO Companies (companyName, description, salary, jobType, companyType, location, eligibility, deadline, applicationLink, rounds, logo_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
            [companyName, description, salary, jobType, companyType, location, eligibility, deadline, applicationLink, rounds, LogoUrl],
            (error, results) => {
                if (error) {
                    console.error("Error inserting job:", error);
                    return res.status(500).json({ error: "Failed to post job" });
                }
                res.status(201).json({ message: "Job posted successfully", result: results.rows[0] });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    postJob,
};