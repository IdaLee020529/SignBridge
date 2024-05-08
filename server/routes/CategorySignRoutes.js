const CategorySignController = require("../controllers/CategorySignController");
const router = require("express").Router();

router.get("/lib/:cat", CategorySignController.fetchSign);

module.exports = router;