import { useMemo } from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useHttp = () => {
  const navigate = useRouter();

  const http = useMemo(() => {
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 20000,
      // if aborted rety request ...ECONNABORTED
    });
  }, []);

  http.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    get: async <T>(url: string) => {
      try {
        const response = await http.get<T>(url);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          //  handle error

          throw new Error(error.response?.data.message);
        }
        throw error;
      }
    },
    post: async <T>(url: string, data?: any, config?: AxiosRequestConfig<any>) => {
      try {
        const response = await http.post<T>(url, data, config);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          //  handle error

          throw new Error(error.response?.data.message ?? error.message);
        }
        throw error;
      }
    },
    put: async <T>(url: string, data?: any) => {
      try {
        const response = await http.put<T>(url, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          //  handle error

          throw new Error(error.response?.data.message);
        }
        throw error;
      }
    },
    delete: async <T>(url: string) => {
      try {
        const response = await http.delete<T>(url);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          //  handle error

          throw new Error(error.response?.data.message);
        }
        throw error;
      }
    },
  };
};
