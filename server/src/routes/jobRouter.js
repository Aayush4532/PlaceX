const router = require("express").Router();
const {getAllJobs, getJobById, postJob} = require("../controllers/jobController");
const { userMiddleware } = require("../middlewares/userMiddleware");

router.get("/opportunities",userMiddleware, getAllJobs);
router.get("/opportunities/:id", userMiddleware, getJobById);
router.post("/opportunities", userMiddleware ,postJob);
// router.put("/opportunities/:id", updateJob);

module.exports = router;