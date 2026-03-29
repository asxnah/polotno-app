const getVideoSize = (
  src: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    // создаем временный video элемент
    const video = document.createElement("video");

    // указываем источник
    video.src = src;

    // чтобы не было проблем с cors
    video.crossOrigin = "anonymous";

    // когда метаданные загружены получаем размеры
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    // обработка ошибки загрузки
    video.onerror = reject;
  });
};
