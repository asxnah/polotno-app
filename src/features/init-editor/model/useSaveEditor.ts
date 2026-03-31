import { useState, useCallback } from "react";

import { store } from "@/shared/config/polotno-store.ts";
import { getQueryParams } from "@/shared/lib/query";
import { storeToVideo } from "@polotno/video-export";

interface SaveOptions {
  onSuccess?: () => void; // функция вызывается если все прошло успешно
  onError?: (message: string) => void; // функция вызывается если произошла ошибка
}

export const useSaveEditor = ({ onSuccess, onError }: SaveOptions = {}) => {
  // состояние идет ли сейчас сохранение
  const [isSaving, setIsSaving] = useState(false);

  // состояние прогресса процесса сохранения от 0 до 100
  const [progress, setProgress] = useState(0);

  // функция save обернута в useCallback, чтобы ее ссылка не менялась без необходимости
  const save = useCallback(async () => {
    // если уже идет сохранение, выходим сразу, чтобы не запустить два процесса одновременно
    if (isSaving) return;

    // включаем флаг сохранения и обнуляем прогресс
    setIsSaving(true);
    setProgress(0);
    console.log("Начинаем сохранение");

    try {
      // получаем параметры из query строки браузера (stepId, токен, путь к бэкенду и т.д.)
      const query = getQueryParams();

      // проверяем есть ли ошибка в query, если есть логируем и выбрасываем ошибку
      if ("error" in query) {
        console.error(query.error); // логируем технически
        throw new Error(query.error); // пользователь увидит это сообщение
      }

      // извлекаем обязательные параметры
      const { stepId, authToken, backendBasePath, mediaId: oldMediaId } = query;

      // проверяем обязательные параметры, если их нет прекращаем процесс и сообщаем пользователю
      if (!stepId || !authToken || !backendBasePath) {
        throw new Error(
          "Невозможно сохранить: отсутствуют необходимые параметры",
        );
      }

      // базовый url для всех запросов к бэкенду
      const baseUrl = backendBasePath;

      // заголовки для fetch запросов, передаем токен авторизации
      const headers = { Authorization: `Bearer ${authToken}` };

      // === подготовка json проекта ===
      setProgress(5);
      console.log("Получаем json проекта из стора");

      // берем текущий проект из store и превращаем его в json
      const projectJson = store.toJSON();

      // создаем blob с json данных для отправки на сервер
      const jsonBlob = new Blob([JSON.stringify(projectJson)], {
        type: "application/json",
      });

      // формируем formData для отправки на сервер
      const jsonForm = new FormData();
      jsonForm.append("file", jsonBlob, "project.json"); // сам файл проекта
      jsonForm.append("type", "action"); // указываем тип медиа

      // === загрузка json проекта на сервер ===
      setProgress(10);
      console.log("Загружаем json проекта в медиа-архив");

      // отправляем проект на сервер
      const jsonRes = await fetch(`${baseUrl}/api/media`, {
        method: "POST",
        headers,
        body: jsonForm,
      });

      // проверяем успешность запроса
      if (!jsonRes.ok)
        throw new Error("Не удалось загрузить проект. попробуйте еще раз");

      // парсим ответ сервера и достаем url загруженного json
      const jsonData = await jsonRes.json();
      const projectConfigUrl = jsonData.data?.[0]?.s3_url;

      // если url не пришел, логируем и показываем пользователю понятное сообщение
      if (!projectConfigUrl) {
        console.error("Нет url проекта: ", jsonData);
        throw new Error("Не удалось сохранить проект. попробуйте еще раз");
      }

      // === привязка json проекта к уроку на сервере ===
      setProgress(20);
      console.log("Сохраняем ссылку на JSON проекта в уроке");

      // делаем PUT запрос, чтобы сервер знал, какой json проекта связан с шагом / уроком
      await fetch(`${baseUrl}/api/step/${stepId}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeDescription: {
            videoEditorProject: { projectConfig: projectConfigUrl },
          },
        }),
      });

      // обновляем прогресс
      setProgress(40);
      console.log("JSON проекта сохранён, рендеринг видео начинается");

      // === рендер видео ===
      // вызываем функцию storeToVideo, которая превращает проект в видео
      const videoBlob = await storeToVideo({
        store: store as unknown as Parameters<typeof storeToVideo>[0]["store"], // костыльная типизация
        fps: 30, // кадров в секунду
        pixelRatio: 1, // качество рендеринга (1 / 2)
        onProgress: (value) => {
          const scaled = 40 + Math.round(value * 50); // масштабируем прогресс
          setProgress(scaled); // обновляем прогресс
        },
      });

      // === подготовка видео для загрузки ===
      const videoForm = new FormData();
      videoForm.append("file", videoBlob, "video.mp4"); // добавляем видео
      videoForm.append("type", "action"); // тип медиа

      // обновляем прогресс
      setProgress(90);
      console.log("Загружаем отрендеренное видео в медиа-архив");

      // отправляем видео на сервер
      const videoRes = await fetch(`${baseUrl}/api/media`, {
        method: "POST",
        headers,
        body: videoForm,
      });

      if (!videoRes.ok) throw new Error("не удалось загрузить видео");

      // парсим ответ сервера и достаем id нового видео
      const videoData = await videoRes.json();
      const newMediaId = videoData.data?.[0]?.id;

      if (typeof newMediaId !== "number")
        throw new Error("ID видео отсутствует");

      // === привязка видео к уроку ===
      // сообщаем серверу, что шаг теперь использует новое видео
      await fetch(`${baseUrl}/api/step/${stepId}/media`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId: newMediaId }),
      });

      // === удаление старого видео, если оно есть ===
      if (oldMediaId) {
        await fetch(`${baseUrl}/api/step/${stepId}/media/${oldMediaId}`, {
          method: "DELETE",
          headers,
        });
      }

      // сохраняем прогресс 100% и вызываем колбек успешного сохранения
      setProgress(100);
      onSuccess?.();
      console.log("Сохранение завершено успешно");
    } catch (e: unknown) {
      // ловим все ошибки, показываем пользователю понятное сообщение
      if (e instanceof Error) {
        onError?.(e.message);
      } else {
        onError?.("Ошибка сохранения");
      }
    } finally {
      // сбрасываем флаг сохранения и прогресс через 800мс
      setIsSaving(false);
      setTimeout(() => setProgress(0), 800);
      console.log("Сброс прогресса, кнопка доступна снова");
    }
  }, [onSuccess, onError, isSaving]);

  // возвращаем функцию сохранения и состояния для компонента
  return { save, isSaving, progress };
};
