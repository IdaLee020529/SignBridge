const LibraryController = require("../controllers/LibraryController");
const router = require("express").Router();


router.get("/lib/fetch-lib", LibraryController.fetchCat);
router.post("/lib/insert-preset-sign", LibraryController.insertPresetSignCategories);

module.exports = router;