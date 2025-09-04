const {Router} = require("express");
const { GetCompanies, AddCompany, DeleteCompany } = require("../controllers/companyController");
const {userMiddleware} = require("../middlewares/userMiddleware.js");
const router = Router();

router.get("/getCompanies", userMiddleware, GetCompanies);
router.post("/addCompany", userMiddleware, AddCompany);
router.delete("/deleteCompany/:id", userMiddleware, DeleteCompany);

module.exports = router;