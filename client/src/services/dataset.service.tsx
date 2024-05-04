//dataset.service.tsx
import axios from "axios";

export const submitForm = async (formData: FormData): Promise<any> => {
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

export const getAllFormsForSignExpert = async (): Promise<any> => {
  try {
    const response = await axios.get(
      "http://localhost:3000/datasetForms/signexpert"
    );
    return response.data; // Assuming the forms are returned in the response data
  } catch (err) {
    throw err;
  }
};

export const getAllFormsForAdmin = async (): Promise<any> => {
  try {
    const response = await axios.get(
      "http://localhost:3000/datasetForms/admin"
    );
    return response.data; // Assuming the forms are returned in the response data
  } catch (err) {
    throw err;
  }
};

export const updateFormById = async (
  formId: number,
  updatedFormData: Record<string, string>
): Promise<any> => {
  try {
    const response = await axios.put(
      `http://localhost:3000/datasetForms/${formId}`,
      updatedFormData,
      {
        headers: {
          "Content-Type": "application/json", // Change content type to JSON
        },
      }
    );
    return response.data; // Return the response data
  } catch (err) {
    throw err;
  }
};
