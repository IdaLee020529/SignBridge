import axios from "axios";
import { use } from "i18next";


export const createLogsByUser = async (data: any) => {
    try {
        const response = await axios.post(
            `http://localhost:3000/logs/user/create`,
            data
        );
        return response;
    } catch (err) {
        throw err;
    }
};

export const deleteAllLogsByUser = async (data : any) => {
    try {
        const response = await axios.delete(
            `http://localhost:3000/logs/user/delete"`,
            data
        );
        return response;
    } catch (err) {
        throw err;
    }
};

export const fetchLogsByUser = async (data: any) => {
    try {
        const response = await axios.post(
            `http://localhost:3000/logs/user`,
            data
        );
        return response;
    } catch (err) {
        throw err;
    }
};


