import { Download } from "lucide-react";

interface SaveButtonProps {
  onSave: () => Promise<void>;
  isSaving: boolean;
  progress: number;
}

export const SaveButton = ({ onSave, isSaving, progress }: SaveButtonProps) => {
  return (
    <button
      onClick={onSave}
      disabled={isSaving}
      className="h-full px-6 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
    >
      {isSaving ? (
        <>
          <span>Сохраняем</span>
          <span className="text-zinc-600">{progress}%</span>
        </>
      ) : (
        <>
          <Download size={18} className="text-zinc-600" />
          <span>Сохранить</span>
        </>
      )}
    </button>
  );
};
