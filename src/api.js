// import axios from "axios";

// let devBaseURL = import.meta.env.VITE_API_BASE_URL;

// const isLocalhost =
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1" ||
//   window.location.hostname.startsWith("192.168.") ||
//   window.location.hostname.startsWith("10.");

// if (!isLocalhost) {
//   devBaseURL = "/api";
// } else if (devBaseURL && devBaseURL.includes("localhost")) {
//   devBaseURL = devBaseURL.replace("localhost", window.location.hostname);
// }

// const api = axios.create({
//   baseURL: devBaseURL || "https://amigowebster.in/nextshow_backend_v2/api",
//    baseURL: "https://amigowebster.in/nextshow_backend_v2/api",
// });

// // Dynamic credentials check to avoid CORS issues on public routes for deployed domains
// api.interceptors.request.use(
//   (config) => {
//     if (config.url && config.url.includes("/auth/")) {
//       config.withCredentials = true;
//     } else {
//       config.withCredentials = false;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // 401 vanthaal local storage mattum clear pannunga.
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem("nextShow_admin");
//     }
//     return Promise.reject(error);
//   },
// );

// export default api;



import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.startsWith("192.168.") ||
  window.location.hostname.startsWith("10.");

let activeBaseURL = "https://amigowebster.in/nextshow_backend_v2/api";

if (!isLocalhost) {
  activeBaseURL = "/api";
} else {
  let devBaseURL = import.meta.env.VITE_API_BASE_URL;
  if (devBaseURL) {
    if (devBaseURL.includes("localhost")) {
      devBaseURL = devBaseURL.replace("localhost", window.location.hostname);
    }
    activeBaseURL = devBaseURL;
  }
}

const api = axios.create({
  baseURL: activeBaseURL,
});

// Dynamic credentials check to avoid CORS issues on public routes for deployed domains
api.interceptors.request.use(
  (config) => {
    if (config.url && config.url.includes("/auth/")) {
      config.withCredentials = true;
    } else {
      config.withCredentials = false;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
