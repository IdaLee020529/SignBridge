const express = require("express");
const DatasetFormController = require("../controllers/DatasetFormController");
const { uploadVideo } = require("../middlewares/multer.middleware")

const router = express.Router()


router.post("/datasetForms", uploadVideo, DatasetFormController.ProcessVideoAndSubmitFormData)
// router.post("/datasetForms", DatasetFormController.ProcessVideoAndSubmitFormData)
router.get("/datasetForms", DatasetFormController.GetAllForms)

module.exports = router;