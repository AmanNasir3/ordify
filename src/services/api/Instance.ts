import axios from "axios";
import config from "../../Config/config.json";
import { clearLocalStorage } from "../../helper/logout";

export const baseURL = config?.production
  ? config?.productionUrl
  : config?.devlopmentUrl;

const Instance = axios.create({
  baseURL: baseURL,
  headers: {
    "content-type": "application/json",
    accept: "application/json",
  },
  validateStatus: () => true,

  withCredentials: true,
});

Instance.interceptors.request.use(
  function (config: any) {
    const session = JSON.parse(localStorage.getItem("session")!);
    config.headers.Authorization = `${session?.token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

Instance.interceptors.response.use(
  (response: any) => {
    if (response.status === 401 || response.status === 500) {
      clearLocalStorage();
      window.location.href = "/";
    } else {
      return response;
    }
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 500) {
      clearLocalStorage();
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export const verifyCode = (code: string) => {
  return Instance({
    method: "POST",
    url: "/ordify/verify",
    data: {
      code: code,
    },
  });
};

export const getCategories = () => {
  return Instance({
    method: "GET",
    url: "/ordify/categories",
  });
};

export const getCarouselImages = () => {
  return Instance({
    method: "GET",
    url: "/ordify/carousel",
  });
};

export const getSubcategoriesByCategory = (categoryId: string) => {
  return Instance({
    method: "GET",
    url: `/ordify/subcategories/${categoryId}`,
  });
};

export const createOrder = (orderData: any) => {
  return Instance({
    method: "POST",
    url: "/ordify/order",
    data: orderData,
  });
};

export const fetchHotelLogoForHeader = async () => {
  return Instance({
    method: "GET",
    url: "/ordify/logo",
  });
};

export default Instance;
