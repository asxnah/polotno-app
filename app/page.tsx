"use client";

import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../src/widgets/editor/ui/EditorPage"), {
  ssr: false,
});

export default function Home() {
  return <Editor />;
}
