import { baseURL } from "./URL";
import axios from "axios";
import { formValues } from "../Components/Dashboard Comp/Dashboard";

export const getUser = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/User/GetAllUser`);
        const userData: formValues[] = response.data;
        console.log('Fetched data:', userData);
        return userData;
    }
    catch (error) {
        console.log(error);
        return [];
    }
};

// export const deleteUser = async (id: string) => {
//     try {
//         const response = await axios.post(`${baseURL}/api/User/${id}DeleteUser`);
//         return response.data;
//     }
//     catch (error) {
//         console.log(error);
//     }
// }

// export const recycleUser = async (id: string) => {
//     try {
//         const response = await axios.post(`${baseURL}/api/User/${id}RecycleUser`);
//         return response.data;
//     }
//     catch (error) {
//         console.log(error);
//     }
// }
