import { useEffect, useState } from "react";

import { getStep } from "@/shared/api/getStep";
import { getQueryParams } from "@/shared/lib/query";
import { loadProject } from "../lib/loadProject";

export const useInitEditor = () => {
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const query = getQueryParams();

        if ("error" in query) {
          throw new Error(query.error);
        }

        const res = await getStep(query);

        if (!res.status) {
          throw new Error("Ошибка API");
        }

        await loadProject({
          data: res.data,
          mediaId: query.mediaId,
        });

        setStatus("ready");
      } catch (e: any) {
        console.error("Ошибка запуска редактора:", e.message);
        setError(e.message);
        setStatus("error");
      }
    };

    init();
  }, []);

  return { status, error };
};
