const DatasetFormService = require("../services/DatasetFormService")
const FirebaseService = require("../services/FirebaseService")

const DatasetFormController = {
    async ProcessVideoAndSubmitFormData(req, res, next) {
        try {
            // const { user_id, name, email, text_sentence, status_SE, status_Admin } = req.body;
            const data = req.body;
            data.user_id = parseInt(data.user_id);
            const avatar_link = "";
            const videoInfo = req.file;
            const videoContent = await FirebaseService.uploadVideoToStorageAndGetURL(videoInfo, "demoVid", "demo");
            if (videoContent) {
                const video_link = videoContent.downloadURL
                const submitted_time = videoContent.timestamp
                const video_name = videoContent.filename
                const result = await DatasetFormService.SubmitForm({ ...data, submitted_time, video_link, video_name, avatar_link })
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

    async UpdateFormStatusWithVideoById(req, res) {
        try {
            const formId = req.params.id;
            const updatedFormData = req.body;
            const form = await DatasetFormService.GetFormById(formId)
            const avatar_link = form.avatar_link
            if (avatar_link != "") {
                await FirebaseService.deleteVideoFromStorage(avatar_link);
            }
            // Handle the uploaded video file
            const videoInfo = req.file;
            const videoContent = await FirebaseService.uploadVideoToStorageAndGetURL(videoInfo, "avatarVid", "avatar");
            if (videoContent) {
                const video_link = videoContent.downloadURL
                const video_name = videoContent.filename
                updatedFormData.avatar_link = video_link;
                updatedFormData.avatar_name = video_name;
                await DatasetFormService.UpdateFormByID(formId, updatedFormData);
                res.status(200).json({ message: "Form updated successfully" });
            }
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
            const video = await DatasetFormService.GetDemoVideoById(formId);
            const downloadUrl = video.videoLink;
            const filename = video.videoName || 'default_video.mp4'; // Set default filename if unavailable
            const response = await fetch(downloadUrl);
            if (!response.ok) {
                throw new Error('Error fetching video');
            }
            const arrayBuffer = await response.arrayBuffer(); // Convert blob to array buffer
            const buffer = Buffer.from(arrayBuffer); // Convert array buffer to buffer
            const contentType = response.headers.get('content-type') || 'video/mp4'; // Use response content type or default to video/mp4

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(buffer); // Send the buffer data as the response body
        } catch (error) {
            console.error("Error fetching video:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    async GetAvatarVideoById(req, res) {
        try {
            const formId = req.params.id;
            const video = await DatasetFormService.GetAvatarVideoById(formId);
            const downloadUrl = video.videoLink;
            const filename = video.videoName || 'default_video.mp4'; // Set default filename if unavailable
            const response = await fetch(downloadUrl);
            if (!response.ok) {
                throw new Error('Error fetching video');
            }
            const arrayBuffer = await response.arrayBuffer(); // Convert blob to array buffer
            const buffer = Buffer.from(arrayBuffer); // Convert array buffer to buffer
            const contentType = response.headers.get('content-type') || 'video/mp4'; // Use response content type or default to video/mp4

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(buffer); // Send the buffer data as the response body
        } catch (error) {
            console.error("Error fetching video:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async DeleteFormById(req, res) {
        try {
            const formId = req.params.id;
            // Assuming you have a deleteById function that handles deletion
            const form = DatasetFormService.GetFormById(formId);
            const videoUrl = form.video_link;
            await FirebaseService.deleteVideoFromStorage(videoUrl);
            await DatasetFormService.DeleteFormByID(formId);
            // Respond with success message
            res.status(200).json({ message: `Form with ID ${formId} deleted successfully` });
        } catch (error) {
            console.error("Error deleting form:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}
module.exports = DatasetFormController