import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:1011/api",
  withCredentials: true
});

export default API;