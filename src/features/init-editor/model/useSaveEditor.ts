import { useState, useCallback } from "react";

import { store } from "@/shared/config/polotno-store.ts";
import { getQueryParams } from "@/shared/lib/query";
import { storeToVideo } from "@polotno/video-export";

interface SaveOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useSaveEditor = ({ onSuccess, onError }: SaveOptions = {}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const save = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setProgress(0);
    console.log("Начинаем сохранение");

    try {
      const query = getQueryParams();
      if ("error" in query) {
        console.error(query.error);
        throw new Error(query.error);
      }

      const { stepId, authToken, backendBasePath, mediaId: oldMediaId } = query;
      if (!stepId || !authToken || !backendBasePath) {
        throw new Error(
          "Невозможно сохранить: отсутствуют необходимые параметры",
        );
      }

      const baseUrl = backendBasePath;
      const headers = { Authorization: `Bearer ${authToken}` };

      // === json проекта ===
      setProgress(5);
      console.log("Получаем JSON проекта из стора");

      const projectJson = store.toJSON();
      const jsonBlob = new Blob([JSON.stringify(projectJson)], {
        type: "application/json",
      });
      const jsonForm = new FormData();
      jsonForm.append("file", jsonBlob, "project.json");
      jsonForm.append("type", "action");

      setProgress(10);
      console.log("Загружаем JSON проекта в медиа-архив");

      const jsonRes = await fetch(`${baseUrl}/api/media`, {
        method: "POST",
        headers,
        body: jsonForm,
      });
      if (!jsonRes.ok)
        throw new Error("Не удалось загрузить проект. Попробуйте еще раз");

      const jsonData = await jsonRes.json();
      const projectConfigUrl = jsonData.data?.[0]?.s3_url;
      if (!projectConfigUrl) {
        console.error("Нет URL проекта: ", jsonData);
        throw new Error("Не удалось сохранить проект. Попробуйте еще раз");
      }

      // === привязка json проекта к уроку ===
      setProgress(20);
      console.log("Сохраняем ссылку на JSON проекта в уроке");

      await fetch(`${baseUrl}/api/step/${stepId}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeDescription: {
            videoEditorProject: { projectConfig: projectConfigUrl },
          },
        }),
      });
      setProgress(40);
      console.log("JSON проекта сохранён, рендеринг видео начинается");

      // === рендер видео ===
      const videoBlob = await storeToVideo({
        store: store as any,
        fps: 30,
        pixelRatio: 1,
        onProgress: (value) => {
          const scaled = 40 + Math.round(value * 50);
          setProgress(scaled);
        },
      });

      // === загрузка mp4 ===
      const videoForm = new FormData();
      videoForm.append("file", videoBlob, "video.mp4");
      videoForm.append("type", "action");

      setProgress(90);
      console.log("Загружаем отрендеренное видео в медиа-архив");

      const videoRes = await fetch(`${baseUrl}/api/media`, {
        method: "POST",
        headers,
        body: videoForm,
      });
      if (!videoRes.ok) throw new Error("Failed to upload video");
      const videoData = await videoRes.json();
      const newMediaId = videoData.data?.[0]?.id;
      if (typeof newMediaId !== "number") throw new Error("Video ID missing");

      // === привязка видео к уроку ===
      await fetch(`${baseUrl}/api/step/${stepId}/media`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId: newMediaId }),
      });

      // === удаление старого видео ===
      if (oldMediaId) {
        await fetch(`${baseUrl}/api/step/${stepId}/media/${oldMediaId}`, {
          method: "DELETE",
          headers,
        });
      }

      setProgress(100);
      onSuccess?.();
      console.log("Сохранение завершено успешно");
    } catch (e: any) {
      onError?.(e.message || "Ошибка сохранения");
    } finally {
      setIsSaving(false);
      setTimeout(() => setProgress(0), 800);
      console.log("Сброс прогресса, кнопка доступна снова");
    }
  }, [onSuccess, onError, isSaving]);

  return { save, isSaving, progress };
};
