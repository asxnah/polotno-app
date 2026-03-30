import "../lib/i18n";

import { AppStore } from "@/shared/config/polotno-store.ts";

import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { PagesTimeline } from "polotno/pages-timeline";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { ToolbarPanel } from "./ToolbarPanel";

interface EditorUIProps {
  store: AppStore;
  onSave: () => Promise<void>;
  isSaving: boolean;
  progress: number;
}

const EditorUI = ({ store, onSave, isSaving, progress }: EditorUIProps) => {
  return (
    <PolotnoContainer style={{ width: "100vw", height: "100vh" }}>
      <SidePanelWrap>
        <SidePanel store={store} />
      </SidePanelWrap>

      <WorkspaceWrap>
        <ToolbarPanel {...{ store, onSave, isSaving, progress }} />
        <Workspace store={store} />
        <ZoomButtons store={store} />
        <PagesTimeline store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};

export default EditorUI;
