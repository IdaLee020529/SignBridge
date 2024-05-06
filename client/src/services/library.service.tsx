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
            "http://localhost:3000/lib/fetch-lib"
        );
        return response;
    } catch (err) {
        throw err;
    }
};
