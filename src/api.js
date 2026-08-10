import axios from "axios";

let devBaseURL = import.meta.env.VITE_API_BASE_URL;
// 2. Client browser-oda dynamic hostname (e.g. localhost or 10.181.5.237) eduthu replace pannunga
if (devBaseURL && devBaseURL.includes("localhost")) {
  devBaseURL = devBaseURL.replace("localhost", window.location.hostname);
}

const api = axios.create({
  baseURL: devBaseURL,
  // baseURL: "https://amigowebster.in/nextshow_backend_v2/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 vanthaal local storage mattum clear pannunga.
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("nextShow_admin");
    }
    return Promise.reject(error);
  },
);

export default api;
