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

export const updateFormWithVideoById = async (
  formId: number,
  updatedFormData: Record<string, string>,
  video: File
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("video", video);

    for (const key in updatedFormData) {
      formData.append(key, updatedFormData[key]);
    }
    console.log("1111");
    console.log(formData);
    const response = await axios.put(
      `http://localhost:3000/datasetForms/avatarVideo/${formId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Use multipart form data for file uploads
        },
      }
    );
    return response.data; // Return the response data
  } catch (err) {
    throw err;
  }
};

export const getFormById = async (formId: number): Promise<any> => {
  try {
    console.log(formId);
    const response = await axios.get(
      `http://localhost:3000/datasetForms/${formId}`
    );

    return response.data; // Assuming the forms are returned in the response data
  } catch (err) {
    throw err;
  }
};

export const getDemoVidById = async (formId: number): Promise<any> => {
  try {
    const response = await axios.get(
      `http://localhost:3000/datasetForms/demoVid/${formId}`,
      { responseType: "arraybuffer" } // Set responseType to 'arraybuffer' to receive raw binary data
    );
    console.log(response);
    return response; // Return the raw binary data
  } catch (err) {
    throw err;
  }
};

export const getAvatarVidById = async (formId: number): Promise<any> => {
  try {
    const response = await axios.get(
      `http://localhost:3000/datasetForms/avatarVid/${formId}`,
      { responseType: "arraybuffer" } // Set responseType to 'arraybuffer' to receive raw binary data
    );
    console.log(response);
    return response; // Return the raw binary data
  } catch (err) {
    throw err;
  }
};
