import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Customer login token automatically attach karo
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("swiss_barber_customer_token") ||
      sessionStorage.getItem("swiss_barber_customer_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Agar token expire/invalid ho jaye
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("swiss_barber_customer_token");
      localStorage.removeItem("swiss_barber_customer_user");

      sessionStorage.removeItem("swiss_barber_customer_token");
      sessionStorage.removeItem("swiss_barber_customer_user");

      window.location.href = "/customer/login";
    }

    return Promise.reject(error);
  }
);

export default api;