import { MediaItem, Step } from "@/entities/step/model/types";
import { store } from "@/shared/config/polotno-store.ts";

export const loadProject = async ({
  data,
  mediaId,
}: {
  data: Step;
  mediaId: number | null;
}) => {
  const projectUrl =
    data?.scheme_description?.videoEditorProject?.projectConfig;
  console.log("URL проекта из API: ", projectUrl);

  if (projectUrl && typeof projectUrl === "string") {
    console.log("Попытка загрузить проект по URL:", projectUrl);
    try {
      const res = await fetch(projectUrl);

      if (!res.ok) {
        throw new Error(`Ошибка загрузки JSON. Статус: ${res.status}`);
      }

      const json = await res.json();

      store.clear();
      store.loadJSON(json);

      return;
    } catch (e) {
      console.error("Не удалось загрузить проект по URL:", e);
    }
  } else {
    console.log("URL проекта отсутствует, fallback...");
  }

  const media = data.media;

  let target: MediaItem | undefined;

  if (mediaId) {
    target = media.find((m: any) => m.file_info?.id === mediaId);
  }

  if (!target) {
    target = media.find((m: any) =>
      m.file_info?.mimetype?.startsWith("video/"),
    );
  }

  if (!target) {
    const m = "Видео не найдено в данных проекта";

    console.error(m);
    throw new Error(m);
  }

  store.clear();
  store.addPage();

  const page = store.pages[0];

  page.addElement({
    type: "video",
    src: target.file_info.s3_url,
    width: 800,
    height: 450,
    x: 0,
    y: 0,
  });
};
