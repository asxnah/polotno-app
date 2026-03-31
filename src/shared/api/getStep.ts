import { StepResponse } from "@/entities/step/model/types";
import { createApiClient } from "./client";

export const getStep = async ({
  stepId,
  authToken,
  backendBasePath,
}: {
  stepId: number;
  authToken: string;
  backendBasePath: string;
}): Promise<StepResponse> => {
  const api = createApiClient(backendBasePath, authToken);

  const { data } = await api.get(`/api/step/${stepId}`);

  return data;
};
