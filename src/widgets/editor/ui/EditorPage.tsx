"use client";

import { useInitEditor } from "@/features/init-editor/model/useInitEditor";
import { store } from "@/shared/config/polotno-store.ts";
import EditorUI from "./EditorUI";

const EditorPage = () => {
  const { status, error } = useInitEditor();

  if (status === "loading") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl font-medium">Загрузка</h1>
        <p className="text-zinc-400">
          Подождите немного, пока мы загружаем редактор
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl font-medium">Произошла ошибка</h1>
        <p className="text-zinc-400">{error}</p>
      </div>
    );
  }

  return <EditorUI store={store} />;
};

export default EditorPage;
