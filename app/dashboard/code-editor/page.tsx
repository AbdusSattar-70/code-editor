"use client";
import React, { useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Montserrat } from "next/font/google";
import { useDebounce } from "use-debounce";
// Internal
import { templates } from "@/lib/code-editor/templates";
import { LivePreview } from "@/components/code-editor/live-preview";
import { getTimestamp } from "@/lib/code-editor/get-timestamp";
import { BottomPanel } from "@/components/code-editor/bottom-panel";
import { NavBar } from "@/components/code-editor/nav-bar";
import { LeftMenu } from "@/components/code-editor/left-menu";
import { LeftSideBar } from "@/components/code-editor/left-side-bar";
import { FileNode } from "@/lib/code-editor/file-node";
import { CodeEditor } from "@/components/code-editor/code-editor";
import { findNodeById } from "@/lib/code-editor/find-node-by-id";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

const CodeEditorPage = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string | null>(
    "html-boilerplate-index"
  );

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [terminalOutput] = useState<string[]>([
    `${getTimestamp()} Welcome to LiCoderZ`,
  ]);

  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: "html-boilerplate",
      name: "HTML Boilerplate",
      type: "folder",
      children: [
        {
          id: "html-boilerplate-index",
          name: "index.html",
          type: "file",
          language: "html",
          content: templates["HTML Boilerplate"].code,
          breakpoints: [3, 11, 1],
        },
        {
          id: "html-boilerplate-styles",
          name: "styles.css",
          type: "file",
          language: "css",
          content: `body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          }`,
          breakpoints: [2, 5, 9],
        },
      ],
    },
    {
      id: "tailwind-setup",
      name: "Tailwind Setup",
      type: "folder",
      children: [
        {
          id: "tailwind-setup-html",
          name: "tailwind.html",
          type: "file",
          language: "html",
          content: templates["Tailwind Setup"].code,
          breakpoints: [3, 11, 1],
        },
        {
          id: "tailwind-setup-css",
          name: "tailwind.css",
          type: "file",
          language: "css",
          content: `body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          }`,
          breakpoints: [2, 5, 9],
        },
      ],
    },
    {
      id: "css-animation",
      name: "CSS Animation",
      type: "folder",
      children: [
        {
          id: "css-animation-html",
          name: "animation.html",
          type: "file",
          language: "html",
          content: templates["CSS Animation"].code,
          breakpoints: [3, 11, 1],
        },
        {
          id: "css-animation-css",
          name: "animation.css",
          type: "file",
          language: "css",
          content: `body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          }`,
          breakpoints: [2, 5, 9],
        },
      ],
    },
    {
      id: "public",
      name: "public",
      type: "folder",
      children: [],
    },
    {
      id: "package-json",
      name: "package.json",
      type: "file",
      language: "json",
      content: `{"name": "pixel-art",
      "version": "0.1.0",
      "private": true,}`,
      breakpoints: [4, 9, 11],
    },
    {
      id: "readme-md",
      name: "README.md",
      type: "file",
      language: "markdown",
      content: `Hello world`,
      breakpoints: [1, 4],
    },
    {
      id: "utils-js",
      name: "utils.js",
      type: "file",
      language: "javascript",
      content: ``,
      breakpoints: [1, 4],
    },
  ]);

  const [code, setCode] = useState("");
  const [debouncedCode] = useDebounce(code, 500);
  const activeFile = activeFileId ? findNodeById(fileTree, activeFileId) : null;
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const leftPanelRef = useRef<React.ElementRef<typeof Panel>>(null);
  const rightPanelRef = useRef<React.ElementRef<typeof Panel>>(null);

  const handleLivePreview = () => {
    if (activeFile && activeFile.type === "file") {
      if (isRunning) {
        setIsRunning(false);
        setConsoleOutput((prev) => [
          ...prev,
          `${getTimestamp()} Live preview paused`,
        ]);
      } else {
        setIsRunning(true);
        setConsoleOutput((prev) => [
          ...prev,
          `${getTimestamp()} Live preview running`,
        ]);
      }
    }
  };

  return (
    <>
      <main
        className={`${montserrat.className} h-screen flex flex-col px-4 ${
          isDarkTheme
            ? "dark bg-[#0e1525] text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <NavBar isDarkTheme={isDarkTheme} />
        <PanelGroup direction="horizontal" className="flex-1">
          <LeftMenu
            activeFile={activeFile}
            setConsoleOutput={setConsoleOutput}
            leftPanelRef={leftPanelRef}
            isLeftCollapsed={isLeftCollapsed}
            isRightCollapsed={isRightCollapsed}
            setIsLeftCollapsed={setIsLeftCollapsed}
            setIsRightCollapsed={setIsRightCollapsed}
            rightPanelRef={rightPanelRef}
            isDarkTheme={isDarkTheme}
            setIsDarkTheme={setIsDarkTheme}
          />

          {/* Left Sidebar */}
          <Panel
            ref={leftPanelRef}
            defaultSize={16}
            minSize={16}
            collapsible={true}
            onCollapse={() => setIsLeftCollapsed(true)}
            onExpand={() => setIsLeftCollapsed(false)}
          >
            <LeftSideBar
              fileTree={fileTree}
              setFileTree={setFileTree}
              setConsoleOutput={setConsoleOutput}
              selectedItemId={selectedItemId}
              setSelectedItemId={setSelectedItemId}
              isDarkTheme={isDarkTheme}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
            />
          </Panel>
          <PanelResizeHandle className="w-0.5 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors z-10" />

          {/* Central Area */}
          <Panel defaultSize={40} minSize={20} className="flex flex-col">
            <PanelGroup direction="vertical" className="flex-1">
              <Panel defaultSize={30} minSize={10}>
                <CodeEditor
                  activeFile={activeFile}
                  setCode={setCode}
                  activeFileId={activeFileId}
                  setFileTree={setFileTree}
                  setConsoleOutput={setConsoleOutput}
                  fileTree={fileTree}
                  setActiveFileId={setActiveFileId}
                  setSelectedItemId={setSelectedItemId}
                  isDarkTheme={isDarkTheme}
                  handleLivePreview={handleLivePreview}
                  isRunning={isRunning}
                />
              </Panel>
              <PanelResizeHandle className="h-0.5 cursor-row-resize hover:bg-blue-500 active:bg-blue-600 transition-colors z-10" />
              <Panel defaultSize={20} minSize={0}>
                <BottomPanel
                  isDarkTheme={isDarkTheme}
                  terminalOutput={terminalOutput}
                  consoleOutput={consoleOutput}
                />
              </Panel>
            </PanelGroup>
          </Panel>
          <PanelResizeHandle className="w-0.5 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors z-10" />

          {/* Right Sidebar Preview Panel */}
          <Panel
            ref={rightPanelRef}
            defaultSize={30}
            minSize={30}
            collapsible={true}
            onCollapse={() => setIsRightCollapsed(true)}
            onExpand={() => setIsRightCollapsed(false)}
          >
            <LivePreview
              setConsoleOutput={setConsoleOutput}
              isDarkTheme={isDarkTheme}
              handleLivePreview={handleLivePreview}
              isRunning={isRunning}
              debouncedCode={debouncedCode}
            />
          </Panel>
        </PanelGroup>
      </main>
    </>
  );
};

export default CodeEditorPage;
