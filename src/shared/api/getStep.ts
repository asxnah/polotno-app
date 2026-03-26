import { StepResponse } from "@/entities/step/model/types";

export const getStep = async ({
  stepId,
  authToken,
  backendBasePath,
}: {
  stepId: number;
  authToken: string;
  backendBasePath: string;
}): Promise<StepResponse> => {
  const url = `${backendBasePath}/api/step/${stepId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    let errorDetails = await res.text();

    try {
      const json = JSON.parse(errorDetails);
      errorDetails = json.message || JSON.stringify(json);
    } catch (e) {
      console.error(e);
    }

    const message = `Ошибка загрузки шага: ${res.status} ${res.statusText} (${errorDetails})`;
    console.error(message);
    throw new Error(message);
  }

  return res.json();
};
