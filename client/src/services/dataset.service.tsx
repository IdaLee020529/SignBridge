//dataset.service.tsx
import axios from "axios";

const submitForm = async (formData: FormData): Promise<any> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/datasetForms",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export default submitForm;
