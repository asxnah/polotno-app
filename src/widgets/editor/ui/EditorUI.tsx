import "../lib/i18n";

import { AppStore } from "@/shared/config/polotno-store.ts";

import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { PagesTimeline } from "polotno/pages-timeline";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";

import { Download, LoaderCircle } from "lucide-react";

interface EditorUIProps {
  store: AppStore;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const EditorUI = ({ store, onSave, isSaving }: EditorUIProps) => {
  return (
    <PolotnoContainer style={{ width: "100vw", height: "100vh" }}>
      <SidePanelWrap>
        <SidePanel store={store} />
      </SidePanelWrap>

      <WorkspaceWrap>
        <div className="flex items-center justify-between">
          <Toolbar store={store} downloadButtonEnabled={false} />
          <button
            onClick={onSave}
            disabled={isSaving}
            className="h-full px-6 flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <LoaderCircle
                  size={18}
                  className="text-zinc-300 animate-spin"
                />
                Сохраняем
              </>
            ) : (
              <>
                <Download size={18} className="text-gray-600" />
                Сохранить
              </>
            )}
          </button>
        </div>
        <Workspace store={store} />
        <ZoomButtons store={store} />
        <PagesTimeline store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};

export default EditorUI;
