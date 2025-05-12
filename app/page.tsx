"use client";
import React, { useState, useRef, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import { useDebounce } from "use-debounce";
import { templates } from "@/lib/templates";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  File,
  FileCode,
  FileJson,
  FileText,
  FileType,
  Pause,
  Play,
  Radio,
  Square,
  SquareArrowOutUpRight,
  TvMinimalPlay,
} from "lucide-react";
import { Fira_Code, Montserrat } from "next/font/google";
import { LivePreview } from "@/components/live-preview";
import { getTimestamp } from "@/lib/get-timestamp";
import { BottomPanel } from "@/components/bottom-panel";
import { NavBar } from "@/components/nav-bar";
import { LeftMenu } from "@/components/left-menu";
import { LeftSideBar } from "@/components/left-side-bar";
import { FileNode } from "@/lib/file-node";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string | null>(
    "html-boilerplate-index"
  );

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
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

  const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.type === "folder" && node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const [executionSteps, setExecutionSteps] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      line: i + 1,
    }))
  );

  const [code, setCode] = useState("");
  const [debouncedCode] = useDebounce(code, 500);
  const activeFile = activeFileId ? findNodeById(fileTree, activeFileId) : null;
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const leftPanelRef = useRef<any>(null);
  const rightPanelRef = useRef<any>(null);

  useEffect(() => {
    if (
      activeFile &&
      activeFile.type === "file" &&
      activeFile.language === "html"
    ) {
      setCode(activeFile.content || "");
    } else {
      setCode("");
    }
  }, [activeFile]);

  useEffect(() => {
    if (!activeFile?.content) return;
    const totalLines = activeFile.content.split("\n").length;
    setExecutionSteps((steps) =>
      steps.filter((step) => step.line <= totalLines)
    );
  }, [activeFile?.content]);

  useEffect(() => {
    setCurrentStepIndex(-1);
  }, [activeFileId]);

  const updateNodeContent = (id: string, content: string) => {
    setFileTree((prevTree) => {
      const updatedTree = JSON.parse(JSON.stringify(prevTree));
      const node = findNodeById(updatedTree, id);
      if (node && node.type === "file") {
        node.content = content;
      }
      return updatedTree;
    });
  };

  const openPreviewInNewTab = () => {
    if (debouncedCode) {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(debouncedCode);
        win.document.close();
        setConsoleOutput((prev) => [
          ...prev,
          `${getTimestamp()} Opened live preview in new tab`,
        ]);
      }
    }
  };

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

  const handleStepOver = () => {
    if (currentStepIndex < executionSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      if (nextIndex === executionSteps.length - 1) {
        toast.info(`${getTimestamp()} Debugging completed`);
        setConsoleOutput((prev) => [
          ...prev,
          `${getTimestamp()} Debugging completed`,
        ]);
      }
    } else {
      setCurrentStepIndex(-1);
      toast.info(`${getTimestamp()} Debugging stopped`);
      setConsoleOutput((prev) => [
        ...prev,
        `${getTimestamp()} Debugging stopped`,
      ]);
    }
  };

  const handleCodeChange = (value?: string) => {
    if (typeof value !== "string") return;
    if (activeFile && activeFile.type === "file") {
      updateNodeContent(activeFile.id, value);
    }
  };

  const handleSave = () => {
    toast.success(
      `${getTimestamp()} File ${activeFile?.name || "unknown"} saved`
    );
    setConsoleOutput((prev) => [
      ...prev,
      `${getTimestamp()} File ${activeFile?.name || "unknown"} saved`,
    ]);
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
            leftPanelRef={leftPanelRef}
            isLeftCollapsed={isLeftCollapsed}
            isRightCollapsed={isRightCollapsed}
            setIsLeftCollapsed={setIsLeftCollapsed}
            setIsRightCollapsed={setIsRightCollapsed}
            handleSave={handleSave}
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
              findNodeById={findNodeById}
              setConsoleOutput={setConsoleOutput}
              selectedItemId={selectedItemId}
              setSelectedItemId={setSelectedItemId}
              isDarkTheme={isDarkTheme}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
            />
          </Panel>
          <PanelResizeHandle className="w-1 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors z-10" />

          {/* Central Area */}
          <Panel defaultSize={40} minSize={20} className="flex flex-col">
            <PanelGroup direction="vertical" className="flex-1">
              <Panel defaultSize={30} minSize={10}>
                <div className="h-full flex flex-col">
                  <div
                    className={`h-10 flex items-center px-3 gap-1 scrollable transition-colors duration-200 ${
                      isDarkTheme
                        ? "bg-gray-800/70 border-gray-700"
                        : "bg-gray-100/70 border-gray-200"
                    } backdrop-blur-sm border-b`}
                  >
                    {fileTree
                      .filter((node) => node.type === "file")
                      .map((file) => (
                        <button
                          key={file.id}
                          onClick={() => {
                            setActiveFileId(file.id);
                            setSelectedItemId(file.id);
                          }}
                          className={`cursor-pointer px-3 py-1 flex items-center text-sm rounded-t-md transition-all ${
                            activeFileId === file.id
                              ? isDarkTheme
                                ? "bg-gray-700 text-white border-t border-l border-r border-blue-500/50"
                                : "bg-white text-gray-900 border-t border-l border-r border-blue-400/50 shadow-sm"
                              : isDarkTheme
                              ? "text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          {file.language === "javascript" && (
                            <FileCode
                              size={14}
                              className="mr-1 text-yellow-500"
                            />
                          )}
                          {file.language === "css" && (
                            <FileType
                              size={14}
                              className="mr-1 text-blue-500"
                            />
                          )}
                          {file.language === "json" && (
                            <FileJson
                              size={14}
                              className="mr-1 text-green-500"
                            />
                          )}
                          {file.language === "markdown" && (
                            <File size={14} className="mr-1 text-green-500" />
                          )}
                          {file.language === "text" && (
                            <FileText
                              size={14}
                              className="mr-1 text-green-500"
                            />
                          )}
                          {file.name}
                        </button>
                      ))}
                  </div>
                  <div
                    className={`h-10 flex items-center justify-between px-3 gap-1 transition-colors duration-200 ${
                      isDarkTheme
                        ? "bg-gray-800/70 border-gray-700"
                        : "bg-gray-100/70 border-gray-200"
                    } backdrop-blur-sm border-b`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setCurrentStepIndex(0);
                          toast.info(`${getTimestamp()} Debugging started`);
                          setConsoleOutput((prev) => [
                            ...prev,
                            `${getTimestamp()} Debugging started`,
                          ]);
                        }}
                        className={`p-1.5 rounded-md transition-colors ${
                          currentStepIndex < 0
                            ? isDarkTheme
                              ? "text-green-400"
                              : "text-green-500"
                            : "text-gray-400"
                        } ${
                          currentStepIndex < 0
                            ? "hover:bg-green-500/20 cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }`}
                        title="Start Debugging"
                        disabled={currentStepIndex >= 0}
                      >
                        <Play size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentStepIndex(-1);
                          toast.info(`${getTimestamp()} Debugging stopped`);
                          setConsoleOutput((prev) => [
                            ...prev,
                            `${getTimestamp()} Debugging stopped`,
                          ]);
                        }}
                        className={`p-1.5 rounded-md transition-colors ${
                          currentStepIndex >= 0
                            ? isDarkTheme
                              ? "text-red-400"
                              : "text-red-500"
                            : "text-gray-400"
                        } ${
                          currentStepIndex >= 0
                            ? "hover:bg-red-500/20 cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }`}
                        title="Stop"
                        disabled={currentStepIndex < 0}
                      >
                        <Square size={16} />
                      </button>
                      <div
                        className={`h-5 mx-1 w-px ${
                          isDarkTheme ? "bg-gray-700" : "bg-gray-300"
                        }`}
                      ></div>
                      <button
                        onClick={handleStepOver}
                        className={`p-1.5 rounded-md transition-colors ${
                          currentStepIndex >= 0
                            ? isDarkTheme
                              ? "text-blue-400"
                              : "text-blue-500"
                            : "text-gray-400"
                        } ${
                          currentStepIndex >= 0
                            ? "hover:bg-blue-500/20 cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }`}
                        title="Step Over"
                        disabled={currentStepIndex < 0}
                      >
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={handleStepOver}
                        className={`p-1.5 rounded-md transition-colors ${
                          currentStepIndex >= 0
                            ? isDarkTheme
                              ? "text-blue-400"
                              : "text-blue-500"
                            : "text-gray-400"
                        } ${
                          currentStepIndex >= 0
                            ? "hover:bg-blue-500/20 cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }`}
                        title="Step Into"
                        disabled={currentStepIndex < 0}
                      >
                        <ArrowDownRight size={16} />
                      </button>
                      <button
                        onClick={handleStepOver}
                        className={`p-1.5 rounded-md transition-colors ${
                          currentStepIndex >= 0
                            ? isDarkTheme
                              ? "text-blue-400"
                              : "text-blue-500"
                            : "text-gray-400"
                        } ${
                          currentStepIndex >= 0
                            ? "hover:bg-blue-500/20 cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }`}
                        title="Step Out"
                        disabled={currentStepIndex < 0}
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                    <button
                      onClick={handleLivePreview}
                      type="button"
                      title={
                        isRunning ? "Pause Live" : "Run the Code to Go Live"
                      }
                      className="ml-2 p-1.5 px-2 py-1 cursor-pointer text-xs font-medium text-center inline-flex gap-0.5 items-center text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                    >
                      {isRunning ? <Pause size={16} /> : <Radio size={16} />}
                      <span>{isRunning ? "Pause Live" : "Go Live"}</span>
                    </button>
                  </div>
                  <div className="flex-1 scrollable">
                    <div
                      className={`${firaCode.style} text-sm leading-6 h-full ${
                        isDarkTheme ? "bg-gray-900" : "bg-white"
                      }`}
                    >
                      {activeFile && activeFile.type === "file" ? (
                        <Editor
                          key={activeFileId}
                          height="100%"
                          defaultLanguage="javascript"
                          value={activeFile.content}
                          theme={isDarkTheme ? "vs-dark" : "light"}
                          onChange={handleCodeChange}
                          options={{
                            fontFamily: "Fira Code",
                            fontSize: 14,
                            minimap: { enabled: true },
                            padding: { top: 30 },
                            lineNumbers: (line) => {
                              const isCurrentLine =
                                currentStepIndex >= 0 &&
                                executionSteps[currentStepIndex]?.line === line;
                              return `${isCurrentLine ? "▶ " : ""}${line}`;
                            },
                          }}
                        />
                      ) : (
                        <div className="p-4 text-gray-500">
                          No file selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Panel>
              <PanelResizeHandle className="h-1 cursor-row-resize hover:bg-blue-500 active:bg-blue-600 transition-colors z-10" />
              <Panel defaultSize={40} minSize={10}>
                <BottomPanel
                  isDarkTheme={isDarkTheme}
                  terminalOutput={terminalOutput}
                  consoleOutput={consoleOutput}
                />
              </Panel>
            </PanelGroup>
          </Panel>
          <PanelResizeHandle className="w-1 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors z-10" />

          {/* Right Sidebar Preview Panel */}
          <Panel
            ref={rightPanelRef}
            defaultSize={30}
            minSize={30}
            collapsible={true}
            onCollapse={() => setIsRightCollapsed(true)}
            onExpand={() => setIsRightCollapsed(false)}
          >
            <div className="h-full p-3 pt-0 scrollable">
              <div
                className={`h-10 flex items-center px-3 gap-1 transition-colors duration-200 ${
                  isDarkTheme
                    ? "bg-gray-800/70 border-gray-700"
                    : "bg-gray-100/70 border-gray-200"
                } backdrop-blur-sm border-b`}
              >
                <h2 className="animate-pulse-subtle text-sm font-medium uppercase tracking-wider text-gray-500 flex items-center">
                  <TvMinimalPlay size={16} className="mr-2 text-blue-500" />
                  Preview
                </h2>
                <div
                  className={`h-5 mx-1 w-px ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-300"
                  }`}
                ></div>
                <button
                  onClick={openPreviewInNewTab}
                  className={`p-1.5 rounded-md transition-colors ${
                    isDarkTheme ? "text-green-400" : "text-green-500"
                  } hover:bg-green-500/20 cursor-pointer`}
                  title="Open in New Tab"
                >
                  <SquareArrowOutUpRight size={16} />
                </button>
              </div>
              <div className="flex flex-col h-[calc(100%-2.5rem)] rounded-md scrollable">
                <div className="flex-grow bg-white w-full">
                  <LivePreview
                    isDarkTheme={isDarkTheme}
                    handleLivePreview={handleLivePreview}
                    isRunning={isRunning}
                    debouncedCode={debouncedCode}
                  />
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkTheme ? "dark" : "light"}
        />
      </main>
    </>
  );
};

export default App;
