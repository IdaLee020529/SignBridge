const CategoryController = require("../controllers/CategoryController");
const router = require("express").Router();


router.get("/lib/categories", CategoryController.fetchCat);
router.post("/lib", CategoryController.insertPresetSignCategories);

module.exports = router;