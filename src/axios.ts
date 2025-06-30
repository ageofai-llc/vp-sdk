import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://voiceagentv2.scoreexl.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
