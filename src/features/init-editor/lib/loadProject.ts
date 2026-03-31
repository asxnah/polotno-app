import { MediaItem, Step } from "@/entities/step/model/types";
import { store } from "@/shared/config/polotno-store.ts";
import { getVideoSize } from "./getVideoSize";

/**
 * загружает проект видео-редактора в store polotno
 * сначала пытается загрузить проект по url из api,
 * если url отсутствует или загрузка не удалась, fallback на медиа из данных шага
 * url внешний, поэтому используем fetch вместо axios
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
  // просто дебаг
  console.log("URL проекта из API: ", projectUrl);

  // если есть ссылка на проект то пробуем загрузить
  if (projectUrl && typeof projectUrl === "string") {
    try {
      const res = await fetch(projectUrl);

      // проверяем пришли ли данные
      if (!res.ok) {
        throw new Error(`Ошибка загрузки JSON. Статус: ${res.status}`);
      }

      const json = await res.json();

      // полностью очищаем текущий store
      store.clear();

      // всегда задаем фиксированный размер канваса
      store.setSize(1920, 1080);

      // загружаем json проекта
      store.loadJSON(json);

      // выходим
      return;
    } catch (e) {
      console.error("Не удалось загрузить проект по URL:", e);
    }
  } else {
    // fallback на видео по id / первое видео в массиве
    console.log("URL проекта отсутствует, fallback...");
  }

  // fallback: ищем медиа в данных шага
  const media = data.media;

  let target: MediaItem | undefined;

  // если указан mediaId, ищем конкретное медиа
  if (mediaId != null) {
    target = media.find((m) => m.file_info?.id === mediaId);
  }

  // если не нашли по id, ищем первый элемент из массива
  if (!target) {
    target = media.find((m) => m.file_info?.mimetype?.startsWith("video/"));
  }

  // если видео не найдено, кидаем ошибку
  if (!target) {
    const m = "Видео не найдено в данных проекта";

    console.error(m);
    throw new Error(m);
  }

  // создаем новый пустой проект
  store.clear();

  // всегда задаем фиксированный размер канваса
  store.setSize(1920, 1080);

  // добавляем одну страницу
  store.addPage();

  const page = store.pages[0];

  // получаем оригинальные размеры видео
  const { width: videoWidth, height: videoHeight } = await getVideoSize(
    target.file_info.s3_url,
  );

  // фиксированные размеры
  const canvasWidth = 1920;
  const canvasHeight = 1080;

  // изначально масштабируем видео по высоте
  let scaledHeight = canvasHeight;

  // рассчитываем ширину пропорционально
  let scaledWidth = (videoWidth / videoHeight) * scaledHeight;

  // если видео слишком широкое
  if (scaledWidth > canvasWidth) {
    // ограничиваем ширину канвасом
    scaledWidth = canvasWidth;

    // и пересчитываем высоту пропорционально
    scaledHeight = canvasWidth / (videoWidth / videoHeight);
  }

  // центрируем по горизонтали
  const x = (canvasWidth - scaledWidth) / 2;

  // центрируем по вертикали (если мы уменьшили высоту)
  const y = (canvasHeight - scaledHeight) / 2;

  // добавляем видео как элемент polotno
  page.addElement({
    type: "video",
    src: target.file_info.s3_url,
    width: scaledWidth,
    height: scaledHeight,
    x,
    y,
  });
};
