import { StepResponse } from "@/entities/step/model/types";

/**
 * получает данные шага по его id
 *
 * @param stepId - идентификатор шага
 * @param authToken - токен авторизации для запроса
 * @param backendBasePath - базовый путь к бэкенду
 * @returns промис с объектом шага типа StepResponse
 * @throws ошибка, если запрос не успешен
 */
export const getStep = async ({
  stepId,
  authToken,
  backendBasePath,
}: {
  stepId: number;
  authToken: string;
  backendBasePath: string;
}): Promise<StepResponse> => {
  // формируем url
  const url = `${backendBasePath}/api/step/${stepId}`;

  // подтягиваем данные
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  // обрабатываем ошибку если она есть
  if (!res.ok) {
    let errorDetails = await res.text();

    try {
      // пробуем распарсить текст ошибки как json
      const json = JSON.parse(errorDetails);
      errorDetails = json.message || JSON.stringify(json);
    } catch (e) {
      console.error(e);
    }

    // формируем и кидаем ошибку
    const message = `Ошибка загрузки шага: ${res.status} ${res.statusText} (${errorDetails})`;
    console.error(message);
    throw new Error(message);
  }

  // возвращаем распарсенный json с данными шага
  return res.json();
};
