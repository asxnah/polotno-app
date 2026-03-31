import axios from "axios";

// функция для создания кастомного axios клиента
export const createApiClient = (baseURL: string, token: string) => {
  // создаем экземпляр axios с базовым url и заголовком авторизации
  const instance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // перехватчик ответов для единой обработки ошибок
  instance.interceptors.response.use(
    // если ответ успешный, возвращаем его как есть
    (res) => res,
    // если произошла ошибка, формируем сообщение и отклоняем промис
    async (error) => {
      const message =
        error?.response?.data?.message || // берем сообщение из ответа сервера
        error?.message || // или из объекта ошибки
        "неизвестная ошибка"; // или дефолтное сообщение

      return Promise.reject(new Error(message)); // отклоняем с новой ошибкой
    },
  );

  // возвращаем настроенный экземпляр axios
  return instance;
};
