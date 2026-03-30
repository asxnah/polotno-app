import { MediaItem, Step } from "@/entities/step/model/types";
import { store } from "@/shared/config/polotno-store.ts";
import { getVideoSize } from "./getVideoSize";

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

  // если есть ссылка на проект то пробуем загрузить
  if (projectUrl && typeof projectUrl === "string") {
    // просто дебаг
    console.log("Попытка загрузить проект по URL:", projectUrl);
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

  // создаем новый пустой проект
  store.clear();
  // добавляем одну страницу
  store.addPage();

  const page = store.pages[0];

  // получаем оригинальные размеры видео
  const { width: videoWidth, height: videoHeight } = await getVideoSize(
    target.file_info.s3_url,
  );

  // размеры
  const canvasWidth = 1920;
  const canvasHeight = 1080;

  let scaledWidth;
  let scaledHeight;
  let x;
  let y;

  // если видео чем 16:9
  if (videoWidth / videoHeight >= canvasWidth / canvasHeight) {
    // растягиваем видео на всю ширину канваса
    scaledWidth = canvasWidth;
    // высоту считаем пропорционально, чтобы не исказить видео
    scaledHeight = (videoHeight / videoWidth) * scaledWidth;

    // по горизонтали заняли пространство
    x = 0;
    // центрируем по вертикали
    y = (canvasHeight - scaledHeight) / 2;
  } else {
    // другие размеры видео

    // масштабируем по высоте
    scaledHeight = canvasHeight;
    // считаем ширину пропорционально
    scaledWidth = (videoWidth / videoHeight) * scaledHeight;

    // центрируем по горизонтали
    x = (canvasWidth - scaledWidth) / 2;
    // по вертикали прижимаем сверху
    y = 0;
  }

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
