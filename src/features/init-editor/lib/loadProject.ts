import { MediaItem, Step } from "@/entities/step/model/types";
import { store } from "@/shared/config/polotno-store.ts";

/**
 * загружает проект видео-редактора в store polotno
 * сначала пытается загрузить проект по url из api,
 * если url отсутствует или загрузка не удалась, fallback на медиа из данных шага
 *
 * @param data - объект шага с media и scheme_description
 * @param mediaId - id медиа для загрузки; если null, то ищется первый элемент из массива
 * @throws ошибка, если не найдено видео для fallback
 */
export const loadProject = async ({
  data,
  mediaId,
}: {
  data: Step;
  mediaId: number | null;
}) => {
  // получаем url проекта из api
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

      // очищаем store и загружаем json проекта
      store.clear();
      store.loadJSON(json);

      return;
    } catch (e) {
      console.error("Не удалось загрузить проект по URL:", e);
    }
  } else {
    console.log("URL проекта отсутствует, fallback...");
  }

  // fallback: ищем медиа в данных шага
  const media = data.media;

  let target: MediaItem | undefined;

  // если указан mediaId, ищем конкретное медиа
  if (mediaId != null) {
    target = media.find((m: any) => m.file_info?.id === mediaId);
  }

  // если не нашли по id, ищем первый элемент из массива
  if (!target) {
    target = media.find((m: any) =>
      m.file_info?.mimetype?.startsWith("video/"),
    );
  }

  // если видео не найдено, кидаем ошибку
  if (!target) {
    const m = "Видео не найдено в данных проекта";

    console.error(m);
    throw new Error(m);
  }

  // создаем новый проект
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
