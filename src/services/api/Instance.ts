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
    if (response.status === 401 && response.data.redirect) {
      clearLocalStorage();
      window.location.reload();
    } else {
      return response;
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      clearLocalStorage();
      window.location.reload();
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

export const getSubcategoriesByCategory = (categoryId: string) => {
  return Instance({
    method: "GET",
    url: `/ordify/subcategories/${categoryId}`,
  });
};

export const fetchHotelLogoForHeader = async (authToken?: string) => {
  try {
    const requestConfig = {
      method: "get",
      url: `${config.devlopmentUrlV3}/logo`,
      responseType: "arraybuffer" as "arraybuffer",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
    };

    // If authToken is provided, add it to the headers
    if (authToken) {
      // @ts-ignore
      requestConfig.headers["Authorization"] = authToken
        .replace(/, undefined$/, "")
        .trim();
    }

    // @ts-ignore
    const response = await axios(requestConfig);

    if (response.status !== 200) {
      return null;
    }

    const base64 = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    );
    return `data:${response.headers["content-type"]};base64,${base64}`;
  } catch (error) {
    console.error("Error fetching hotel logo:", error);
    return null;
  }
};

export default Instance;
