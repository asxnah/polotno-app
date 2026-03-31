import { StepResponse } from "@/entities/step/model/types";
import { createApiClient } from "./client";

// функция для получения данных шага по его id
export const getStep = async ({
  stepId, // id шага, который нужно получить
  authToken, // токен авторизации для доступа к API
  backendBasePath, // базовый путь к бекенду
}: {
  stepId: number;
  authToken: string;
  backendBasePath: string;
}): Promise<StepResponse> => {
  // создаем клиент API с базовым путем и токеном авторизации
  const api = createApiClient(backendBasePath, authToken);

  // выполняем GET-запрос к эндпоинту шага
  const { data } = await api.get(`/api/step/${stepId}`);

  // возвращаем полученные данные шага
  return data;
};
