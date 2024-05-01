const express = require("express");
const DatasetFormController = require("../controllers/DatasetFormController");
const multerMiddleware = require("../middlewares/multer.middleware")

const router = express.Router()


router.post("/datasetForms", multerMiddleware, DatasetFormController.ProcessVideoAndSubmitFormData)
// router.post("/datasetForms", DatasetFormController.ProcessVideoAndSubmitFormData)
router.get("/datasetForms", DatasetFormController.GetAllForms)

module.exports = router;