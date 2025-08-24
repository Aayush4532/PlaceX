const getAllJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs();
        res.status(200).json(jobs);
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

module.exports = {
    getAllJobs,
    getJobById,
};