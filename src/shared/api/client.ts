import axios from "axios";

export const createApiClient = (baseURL: string, token: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // перехватчик ошибок (единая обработка)
  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Неизвестная ошибка";

      return Promise.reject(new Error(message));
    },
  );

  return instance;
};
