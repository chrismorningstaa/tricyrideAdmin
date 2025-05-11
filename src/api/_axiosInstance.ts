import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: "https://tricyride.runasp.net/api",
  headers: { "X-Custom-Header": "foobar" },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    const { message } = error;
    return Promise.reject(error);
  }
);
export default axiosInstance;
