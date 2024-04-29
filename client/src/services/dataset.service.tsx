//dataset.service.tsx
import axios from "axios";

const submitForm = async (formData: any): Promise<any> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/datasetForms",
      formData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default submitForm;
