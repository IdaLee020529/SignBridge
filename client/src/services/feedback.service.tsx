import axios from "axios";

// ---------- Create Feedback ----------
export const CreateFeedback = async (data: any) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/feedbacks/create-feedback",
      data
    );
    return response;
  } catch (err) {
    throw err;
  }
};

// ---------- Get Feedback ----------
export const GetFeedback = async () => {
  try {
    const response = await axios.get("http://localhost:3000/feedbacks/fetch-feedback");
    return response;
  } catch (err) {
    throw err;
  }
};

// ---------- Update Feedback ----------
export const UpdateFeedback = async (feedbackId: number) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/feedbacks/update-feedback-status/${feedbackId}`,
    );
    return response;
  } catch (err) {
    throw err;
  }
};