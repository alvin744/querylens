import axios from "axios";

const API = axios.create({
  baseURL: "https://querylens-m8mh.onrender.com",
});

export default API;