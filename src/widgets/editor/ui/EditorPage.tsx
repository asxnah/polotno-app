"use client";

import { useInitEditor } from "@/features/init-editor/model/useInitEditor";
import { store } from "@/shared/config/polotno-store.ts";

import EditorUI from "./EditorUI";

import { LoaderCircle, X } from "lucide-react";

const EditorPage = () => {
  const { status, error } = useInitEditor();

  const mockIsSaving = true;
  const mockSave = async () => {
    return;
  };

  if (status === "loading") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
        <LoaderCircle className="text-zinc-300 animate-spin" />
        <h1 className="text-xl font-medium">Загрузка</h1>
        <p className="text-zinc-400">
          Подождите немного, пока мы запускаем редактор
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
        <X className="text-zinc-300" />
        <h1 className="text-xl font-medium">Что-то пошло не так</h1>
        <p className="text-zinc-400">{error}</p>
      </div>
    );
  }

  return <EditorUI store={store} onSave={mockSave} isSaving={mockIsSaving} />;
};

export default EditorPage;
