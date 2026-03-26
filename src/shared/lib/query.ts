export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);

  const stepId = params.get("stepId");
  const authToken = params.get("authToken");
  const backendBasePath = params.get("backendBasePath");
  const frontendBasePath = params.get("frontendBasePath");
  const mediaId = params.get("mediaId");

  const missingParams: string[] = [];
  if (!stepId) missingParams.push("stepId");
  if (!authToken) missingParams.push("authToken");
  if (!backendBasePath) missingParams.push("backendBasePath");
  if (!frontendBasePath) missingParams.push("frontendBasePath");

  if (missingParams.length) {
    const message = `Отсутствуют необходимые параметры: ${missingParams.join(", ")}`;
    console.error("Отсутствуют необходимые параметры:", message);
    return { error: message };
  }

  return {
    stepId: Number(stepId),
    authToken: authToken!,
    backendBasePath: decodeURIComponent(backendBasePath!),
    frontendBasePath: decodeURIComponent(frontendBasePath!),
    mediaId: mediaId ? Number(mediaId) : null,
  };
};
