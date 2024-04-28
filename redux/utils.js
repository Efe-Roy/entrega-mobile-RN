import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// const URL = "http://10.0.2.2:8000";
const URL = "https://fiscaliaycontraloria.com";
export const baseURL = `${URL}/api`

const API = axios.create({
    baseURL: `${URL}/api`,
});

API.interceptors.request.use(async (req) => {
    console.log("jwtToken");
    try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        req.headers.Authorization = `Token ${jwtToken}`;
        return req;
    } catch (error) {
        console.error("Error getting token from AsyncStorage:", error);
        return req;
    }
});

export default API;

