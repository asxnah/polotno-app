"use client";

import { useState } from "react";

import { useInitEditor } from "@/features/init-editor/model/useInitEditor";
import { store } from "@/shared/config/polotno-store.ts";
import { useSaveEditor } from "@/features/init-editor/model/useSaveEditor";

import EditorUI from "../ui/EditorUI";
import { Toast } from "../ui/Toast";
import { LoaderCircle, X } from "lucide-react";

const EditorPage = () => {
  const { status, error } = useInitEditor();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { save, isSaving, progress } = useSaveEditor({
    onSuccess: () => setToast({ message: "Сохранено", type: "success" }),
    onError: (e) =>
      setToast({ message: `Ошибка сохранения: ${e}`, type: "error" }),
  });

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

  return (
    <>
      <EditorUI
        store={store}
        onSave={save}
        isSaving={isSaving}
        progress={progress}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default EditorPage;
