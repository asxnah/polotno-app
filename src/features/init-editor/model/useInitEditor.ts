import { useEffect, useState } from "react";

import { getStep } from "@/shared/api/getStep";
import { getQueryParams } from "@/shared/lib/query";
import { loadProject } from "../lib/loadProject";

export const useInitEditor = () => {
  // состояние статуса редактора
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  // состояние для хранения текста ошибки
  const [error, setError] = useState("");

  useEffect(() => {
    // функция запуска редактора
    const init = async () => {
      try {
        // получаем параметры из query строки
        const query = getQueryParams();

        // если в query есть поле error, кидаем исключение
        if ("error" in query) {
          throw new Error(query.error);
        }

        // делаем запрос к api для получения данных шага
        const res = await getStep(query);

        // кидаем ошибку если есть
        if (!res.status) {
          throw new Error("Ошибка API");
        }

        // загружаем проект с полученными данными и mediaId из query
        await loadProject({
          data: res.data,
          mediaId: query.mediaId,
        });

        // если все прошло успешно, ставим статус ready
        setStatus("ready");
      } catch (e: any) {
        // логируем ошибку и обновляем состояния error и status
        console.error("Ошибка запуска редактора:", e.message);
        setError('Ошибка на стороне сервера');
        setStatus("error");
      }
    };

    // вызываем инициализацию один раз при монтировании компонента
    init();
  }, []);

  // возвращаем статус и текст ошибки
  return { status, error };
};
