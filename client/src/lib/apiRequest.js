import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://realar-2w37.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;