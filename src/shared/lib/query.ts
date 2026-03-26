export const getQueryParams = () => {
  // создаем объект urlsearchparams из строки запроса текущего окна
  const params = new URLSearchParams(window.location.search);

  // получаем значения параметров из url
  const stepId = params.get("stepId");
  const authToken = params.get("authToken");
  const backendBasePath = params.get("backendBasePath");
  const frontendBasePath = params.get("frontendBasePath");
  const mediaId = params.get("mediaId");

  // массив для хранения отсутствующих обязательных параметров
  const missingParams: string[] = [];
  if (!stepId) missingParams.push("stepId");
  if (!authToken) missingParams.push("authToken");
  if (!backendBasePath) missingParams.push("backendBasePath");
  if (!frontendBasePath) missingParams.push("frontendBasePath");

  // если есть отсутствующие параметры, выводим ошибку и возвращаем объект с error
  if (missingParams.length) {
    const message = `Отсутствуют необходимые параметры: ${missingParams.join(", ")}`;
    console.error("Отсутствуют необходимые параметры:", message);
    return { error: message };
  }

  // возвращаем объект с проверенными и преобразованными параметрами
  return {
    stepId: Number(stepId), // приводим stepId в число
    authToken: authToken!, // authToken гарантированно присутствует
    backendBasePath: decodeURIComponent(backendBasePath!), // декодируем url для backend
    frontendBasePath: decodeURIComponent(frontendBasePath!), // декодируем url для frontend
    mediaId: mediaId ? Number(mediaId) : null, // если есть mediaId, то приводим в число, иначе null
  };
};
