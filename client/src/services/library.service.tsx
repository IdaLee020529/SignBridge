import axios from "axios";


export const CreateCategory = async (data: any) => {
    try {
        const response = await axios.post(
            "http://localhost:3000/lib/create-category",
            data
        );
        return response;
    } catch (err) {
        throw err;
    }
};


export const UpdateCategory = async (data: any) => {
    try {
        const response = await axios.put(
            `http://localhost:3000/lib/update-category/${data.category_id}`,
            data
        );
        return response;
    } catch (err) {
        throw err;
    }
};

export const fetchCat = async () => {
    try {
        const response = await axios.get(
            "http://localhost:3000/lib/categories"
        );
        return response;
    } catch (err) {
        throw err;
    }
};

export const fetchSign = async (cat: string): Promise<any> => {
    try {
      console.log(cat);
      const response = await axios.get(
        `http://localhost:3000/lib/${cat}`
      );
  
      console.log(response.data);
      return response.data; // Assuming the forms are returned in the response data
    } catch (err) {
      throw err;
    }
  };
