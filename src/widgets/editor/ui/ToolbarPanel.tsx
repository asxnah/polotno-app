import { AppStore } from "@/shared/config/polotno-store.ts";
import { Toolbar } from "polotno/toolbar/toolbar";
import { SaveButton } from "./SaveButton";

interface ToolbarPanelProps {
  store: AppStore;
  onSave: () => Promise<void>;
  isSaving: boolean;
  progress: number;
}

export const ToolbarPanel = ({
  store,
  onSave,
  isSaving,
  progress,
}: ToolbarPanelProps) => (
  <div className="flex items-center justify-between">
    <Toolbar store={store} downloadButtonEnabled={false} />
    <SaveButton onSave={onSave} isSaving={isSaving} progress={progress} />
  </div>
);
