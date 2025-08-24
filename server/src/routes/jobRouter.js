const router = require("express").Router();
const {getAllJobs, getJobById} = require("../controllers/jobController");

router.get("/opportunities", getAllJobs);
router.get("/opportunities/:id", getJobById);
// router.put("/opportunities/:id", updateJob);

module.exports = router;