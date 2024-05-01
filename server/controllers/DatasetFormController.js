const DatasetFormService = require("../services/DatasetFormService")
const FirebaseService = require("../services/FirebaseService")

const DatasetFormController = {
    async ProcessVideoAndSubmitFormData(req, res, next) {
        try {
            const { user_id, name, email, text_sentence, status_SE, status_Admin } = req.body;
            const avatar_link = "";
            const videoInfo = req.file;
            const videoURL = await FirebaseService.uploadVideoToStorageAndGetURL(videoInfo);
            if (videoURL) {
                const result = await DatasetFormService.SubmitForm({ user_id, name, email, text_sentence, status_SE, status_Admin, videoURL, avatar_link })
                res.status(201).json(result);
            }
        } catch (error) {
            next(error)
        }
    },

    async GetAllForms(req, res) {
        try {
            const forms = await DatasetFormService.GetAllForms();
            res.status(200).json(forms);
        } catch (error) {
            console.error("Error fetching forms:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
module.exports = DatasetFormController