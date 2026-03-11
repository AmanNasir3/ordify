import axios from 'axios'
import config from '../../Config/config.json'
import { clearLocalStorage } from '../../helper/logout'
import useSession from '../../helper/useSession'
const slug = useSession('hotel_slug', null)

export const baseURL = config?.production
  ? config?.productionUrl
  : config?.devlopmentUrl

const Instance = axios.create({
  baseURL: baseURL,
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
  validateStatus: () => true,

  withCredentials: true,
})

Instance.interceptors.request.use(
  function (config: any) {
    const session = JSON.parse(localStorage.getItem('session')!)
    config.headers.Authorization = `${session?.token}`
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

Instance.interceptors.response.use(
  (response:any) => {
    if (response.status === 401 && response.data.redirect) {
      clearLocalStorage()
      window.location.href = `/${slug}/login`
    } else {
      return response
    }
  },
  (error) => {
    if (error.response.status === 401 && error.response.data.redirect) {
      clearLocalStorage()
      window.location.href = `/${slug}/login`
    }
  }
)

export const InstanceV2 = axios.create({
  baseURL: config.devlopmentUrlV2,
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
  validateStatus: () => true,

  withCredentials: true,
})
InstanceV2.interceptors.request.use(
  function (config: any) {
    const session = JSON.parse(localStorage.getItem('session')!)
    config.headers.Authorization = `${session?.token}`
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
InstanceV2.interceptors.response.use(
  (response:any) => {
    if (response.status === 401 && response.data.redirect) {
      clearLocalStorage()
      window.location.href = `/${slug}/login`
    } else {
      return response
    }
  },
  (error) => {
    if (error.response.status === 401 && error.response.data.redirect) {
      clearLocalStorage()
      window.location.href = `/${slug}/login`
    }
  }
)

export const InstanceV3 = axios.create({
  baseURL: config.devlopmentUrlV3,
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
  validateStatus: () => true,

  withCredentials: true,
})
InstanceV3.interceptors.request.use(
  function (config: any) {
    const session = JSON.parse(localStorage.getItem('session')!)
    config.headers.Authorization = `${session?.token}`
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
InstanceV3.interceptors.response.use(
  (response:any) => {
    if (response.status === 401 && response.data.redirect) {
      clearLocalStorage()
      window.location.href = `/${slug}/login`
    } else {
      return response
    }
  },
  (error) => {
    if (error.response.status === 401 && error.response.data.redirect) {
      clearLocalStorage()
      window.location.href = `/${slug}/login`
    }
  }
)

export const verifyCode = (code: string) => {
  return Instance({
    method: 'POST',
    url: '/ordify/verify',
    data: {
      code: code,
    },
  })
}

export const getCategories = () => {
  return Instance({
    method: 'GET',
    url: '/ordify/categories',
  })
}

export const getSubcategoriesByCategory = (categoryId: string) => {
  return Instance({
    method: 'GET',
    url: `/ordify/subcategories/${categoryId}`,
  })
}

export const fetchHotelLogoForHeader = async (authToken?: string) => {
  try {
    const requestConfig = {
      method: 'get',
      url: `${config.devlopmentUrlV3}/logo`,
      responseType: 'arraybuffer' as 'arraybuffer',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
    }

    // If authToken is provided, add it to the headers
    if (authToken) {
      // @ts-ignore
      requestConfig.headers['Authorization'] = authToken
        .replace(/, undefined$/, '')
        .trim()
    }

    // @ts-ignore
    const response = await axios(requestConfig)

    if (response.status !== 200) {
      return null
    }

    const base64 = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    )
    return `data:${response.headers['content-type']};base64,${base64}`
  } catch (error) {
    console.error('Error fetching hotel logo:', error)
    return null
  }
}

export default Instance
