const DatasetFormService = require("../services/DatasetFormService")
const FirebaseService = require("../services/FirebaseService")

const DatasetFormController = {
    async ProcessVideoAndSubmitFormData(req, res, next) {
        try {
            const { user_id, name, email, text_sentence, status_SE, status_Admin } = req.body;
            const avatar_link = "";
            const videoInfo = req.file;
            const videoContent = await FirebaseService.uploadVideoToStorageAndGetURL(videoInfo);
            if (videoContent) {
                const video_link = videoContent.downloadURL
                const submitted_time = videoContent.timestamp
                const video_name = videoContent.formattedDateTime
                const result = await DatasetFormService.SubmitForm({ user_id: parseInt(user_id), name, email, text_sentence, submitted_time, status_SE, status_Admin, video_link, video_name, avatar_link })
                res.status(201).json(result);
            }
        } catch (error) {
            next(error)
        }
    },

    async GetAllFormsForSignExpert(req, res) {
        try {
            const forms = await DatasetFormService.GetAllFormsForSignExpert();
            res.status(200).json(forms);
        } catch (error) {
            console.error("Error fetching forms:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async GetAllFormsForAdmin(req, res) {
        try {
            const forms = await DatasetFormService.GetAllFormsForAdmin();
            res.status(200).json(forms);
        } catch (error) {
            console.error("Error fetching forms:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async UpdateFormStatusById(req, res) {
        try {
            const formId = req.params.id;
            const updatedFormData = req.body;
            await DatasetFormService.UpdateFormByID(formId, updatedFormData);
            res.status(200).json({ message: "Form updated successfully" });
        } catch (error) {
            console.error("Error updating form:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    async GetFormById(req, res) {
        try {
            const formId = req.params.id;
            const formDetail = await DatasetFormService.GetFormById(formId);
            res.status(200).json(formDetail)
        } catch (error) {
            console.error("Error updating form:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async GetDemoVideoById(req, res) {
        try {
            const formId = req.params.id;
            const video_link = await DatasetFormService.GetDemoVideoById(formId);
            await FirebaseService.downloadVideoFromStorage(video_link)
        } catch (error) {
            console.error("Error updating form:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}
module.exports = DatasetFormController