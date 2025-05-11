"use client";
import React, { useState, useRef, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import dayjs from "dayjs";
import { useDebounce } from "use-debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Brain,
  ChevronDown,
  ChevronRight,
  File,
  FileCode,
  FileJson,
  FilePlus,
  FileText,
  FileType,
  Folder,
  FolderOpen,
  FolderPlus,
  Monitor,
  MonitorCheck,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Play,
  Radio,
  RefreshCcw,
  Save,
  Square,
  SquareArrowOutUpRight,
  Sun,
  TvMinimalPlay,
} from "lucide-react";
import { Fira_Code, Montserrat, Poppins } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const getTimestamp = (): string => `[${dayjs().format("h:mm:ss A")}]`;

// Template Mock data
const templates = {
  "HTML Boilerplate": {
    name: "HTML Boilerplate",
    language: "html",
    code: `<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <style>
    /* Ensure full width and height */
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      width: 100%;
      font-family: sans-serif;
    }
    body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #f9f9f9;
    }
     h1 {
      text-align: center;
      color: #6A5;
    }
    p {
      color: #66;
    }
  </style>
</head>
<body>
  <h1>Hello, world!</h1>
  <p>Start editing to see changes in real-time!</p>
</body>
</html>`,
  },
  "Tailwind Setup": {
    name: "Tailwind Setup",
    language: "html",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tailwind</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center">
  <div class="h-screen w-full p-6 bg-white rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">Tailwind Ready</h1>
    <p class="text-gray-600 mb-4">Start building beautiful UIs with Tailwind CSS</p>
    <div class="grid grid-cols-2 gap-4">
      <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
        Button 1
      </button>
      <button class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition">
        Button 2
      </button>
    </div>
  </div>
</body>
</html>`,
  },
  "CSS Animation": {
    name: "CSS Animation",
    language: "html",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Animation</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
      margin: 0;
    }
    .box {
      width: 100px;
      height: 100px;
      background-color: #0070f3;
      border-radius: 8px;
      animation: bounce 2s infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-50px); }
    }
  </style>
</head>
<body>
  <div class="box"></div>
</body>
</html>`,
  },
};

type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  content?: string;
  breakpoints?: number[];
  children?: FileNode[];
};

interface BottomPanelProps {
  isDarkTheme: boolean;
  terminalOutput: string[];
  consoleOutput: string[];
}

interface LivePreviewProps {
  isRunning: boolean;
  debouncedCode: string;
  handleLivePreview: () => void;
  isDarkTheme: boolean;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  isRunning,
  debouncedCode,
  handleLivePreview,
  isDarkTheme,
}) => {
  const wrapperClass = `flex flex-col items-center justify-center h-full w-full ${
    isDarkTheme ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
  }`;

  const messageClass = "text-center font-semibold text-sm px-5 py-3";

  const buttonClass = `mt-4 text-white bg-[#4285F4] hover:bg-[#4285F4]/90
    focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50
    font-medium rounded-lg text-sm px-6 py-3 text-center
    inline-flex items-center gap-2 cursor-pointer ${
      isDarkTheme ? "dark:focus:ring-[#4285F4]/55" : ""
    }`;

  if (!debouncedCode) {
    return (
      <div className={wrapperClass}>
        <h2 className={`${messageClass} !text-xl font-bold`}>
          Oops! No preview available.
        </h2>
        <p className={messageClass}>
          Please select an HTML file from the file explorer or create a new
          project by adding folders and files. Note: The preview browser can
          only render HTML files.
        </p>
        <p className={messageClass}>
          Click "Go Live" to see real-time changes.
        </p>
      </div>
    );
  }

  if (!isRunning) {
    return (
      <div className={wrapperClass}>
        <p className={messageClass}>To see changes in real-time</p>
        <button
          onClick={handleLivePreview}
          type="button"
          title={isRunning ? "Pause Live" : "Run the Code to Go Live"}
          className={buttonClass}
        >
          {isRunning ? <Pause size={18} /> : <Radio size={18} />}
          <span>{isRunning ? "Pause Live" : "Go Live"}</span>
        </button>
      </div>
    );
  }

  return (
    <iframe
      title="Live Preview"
      className="h-full w-full"
      sandbox="allow-scripts"
      srcDoc={debouncedCode}
    />
  );
};

const BottomPanel: React.FC<BottomPanelProps> = ({
  isDarkTheme,
  terminalOutput,
  consoleOutput,
}) => {
  const [activeTab, setActiveTab] = useState("console");

  const tabs = [
    { key: "console", label: "Console" },
    { key: "terminal", label: "Terminal" },
    { key: "problems", label: "Problems" },
  ];

  const getTabButtonClass = (tabKey: string) => {
    const base =
      "px-4 py-2 text-sm font-medium transition-colors cursor-pointer";
    const active = activeTab === tabKey;
    return `${base} ${
      active
        ? isDarkTheme
          ? "border-b-2 border-blue-500 text-blue-400"
          : "border-b-2 border-blue-600 text-blue-600"
        : isDarkTheme
        ? "text-gray-400 hover:text-gray-300"
        : "text-gray-600 hover:text-gray-800"
    }`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-gray-700 scrollable">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={getTabButtonClass(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 scrollable">
        <div className="p-2 text-sm h-full">
          {["terminal", "console"].includes(activeTab) && (
            <>
              {(activeTab === "terminal" ? terminalOutput : consoleOutput).map(
                (line, index) => (
                  <div
                    key={index}
                    className={isDarkTheme ? "text-gray-300" : "text-gray-800"}
                  >
                    {line}
                  </div>
                )
              )}
              <div className="flex items-center mt-1">
                <span
                  className={`mr-2 ${
                    isDarkTheme ? "text-green-400" : "text-green-600"
                  }`}
                >
                  $
                </span>
                <input
                  type="text"
                  className={`flex-1 bg-transparent border-none outline-none ${
                    isDarkTheme ? "text-gray-300" : "text-gray-800"
                  }`}
                  placeholder="Type a command..."
                />
              </div>
            </>
          )}

          {activeTab === "problems" && (
            <p className={isDarkTheme ? "text-gray-300" : "text-gray-800"}>
              $ No problems detected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string | null>(
    "html-boilerplate-index"
  );
  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    "html-boilerplate",
  ]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    `${getTimestamp()} Welcome to LiCoderZ`,
  ]);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D0"
  );
  const [creatingNode, setCreatingNode] = useState<{
    type: "file" | "folder";
    parentId: string | null;
  } | null>(null);

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const findParentNode = (
    nodes: FileNode[],
    childId: string
  ): FileNode | null => {
    for (const node of nodes) {
      if (node.type === "folder" && node.children) {
        if (node.children.some((child) => child.id === childId)) {
          return node;
        }
        const found = findParentNode(node.children, childId);
        if (found) return found;
      }
    }
    return null;
  };

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const addNode = (newNode: FileNode, parentId: string | null) => {
    setFileTree((prevTree) => {
      if (!parentId) {
        return [...prevTree, newNode];
      } else {
        const updatedTree = JSON.parse(JSON.stringify(prevTree));
        const parentNode = findNodeById(updatedTree, parentId);
        if (parentNode && parentNode.type === "folder") {
          parentNode.children = parentNode.children || [];
          parentNode.children.push(newNode);
        }
        return updatedTree;
      }
    });
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "html":
        return "html";
      case "js":
        return "javascript";
      case "css":
        return "css";
      case "json":
        return "json";
      case "md":
        return "markdown";
      case "txt":
        return "text";
      default:
        return "text";
    }
  };

  const initiateCreateFile = () => {
    let parentId: string | null = null;
    if (selectedItemId) {
      const selectedNode = findNodeById(fileTree, selectedItemId);
      if (selectedNode) {
        if (selectedNode.type === "folder") {
          parentId = selectedNode.id;
          toggleFolder(parentId);
        } else if (selectedNode.type === "file") {
          const parentNode = findParentNode(fileTree, selectedNode.id);
          parentId = parentNode ? parentNode.id : null;
        }
      }
    }
    setCreatingNode({ type: "file", parentId });
  };

  const initiateCreateFolder = () => {
    let parentId: string | null = null;
    if (selectedItemId) {
      const selectedNode = findNodeById(fileTree, selectedItemId);
      if (selectedNode) {
        if (selectedNode.type === "folder") {
          parentId = selectedNode.id;
          toggleFolder(parentId);
        } else if (selectedNode.type === "file") {
          const parentNode = findParentNode(fileTree, selectedNode.id);
          parentId = parentNode ? parentNode.id : null;
        }
      }
    }
    setCreatingNode({ type: "folder", parentId });
  };

  const handleCreateNode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current && creatingNode) {
      const name = inputRef.current.value.trim();
      if (name) {
        const newNode: FileNode = {
          id: Date.now().toString(),
          name,
          type: creatingNode.type,
          ...(creatingNode.type === "file" && {
            language: getLanguageFromExtension(name),
            content: "",
            breakpoints: [],
          }),
          ...(creatingNode.type === "folder" && { children: [] }),
        };
        addNode(newNode, creatingNode.parentId);
        setCreatingNode(null);
      }
    } else if (e.key === "Escape") {
      setCreatingNode(null);
    }
  };

  useEffect(() => {
    if (creatingNode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [creatingNode]);

  const refreshExplorer = () => {
    toast.info(`${getTimestamp()} Explorer refreshed`);
    setConsoleOutput((prev) => [
      ...prev,
      `${getTimestamp()} Explorer refreshed`,
    ]);
  };

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

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
        toast.success("Profile Photo Updated Success!");
      };
      reader.readAsDataURL(file);
    }
  };

  const FileTreeNode = ({
    node,
    depth = 0,
  }: {
    node: FileNode;
    depth?: number;
  }) => {
    const isExpanded = expandedFolders.includes(node.id);
    return (
      <div className={poppins.className} style={{ marginLeft: depth * 16 }}>
        {node.type === "folder" ? (
          <>
            <div
              onClick={() => {
                setSelectedItemId(node.id);
                toggleFolder(node.id);
              }}
              className={`w-full flex items-center justify-between px-2 py-1 rounded-md cursor-pointer hover:bg-gray-700/30 transition-colors ${
                selectedItemId === node.id ? "text-green-500" : ""
              }`}
            >
              <div className="flex items-center">
                <Folder size={16} className="mr-2 text-blue-400" />
                <span className="text-sm">{node.name}</span>
              </div>
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </div>
            {isExpanded && (
              <div className="mt-1 space-y-1">
                {node.children &&
                  node.children.map((child) => (
                    <FileTreeNode
                      key={child.id}
                      node={child}
                      depth={depth + 1}
                    />
                  ))}
                {creatingNode && creatingNode.parentId === node.id && (
                  <div className="flex items-center px-2 py-1">
                    {creatingNode.type === "file" ? (
                      <File size={16} className="mr-2 text-gray-400" />
                    ) : (
                      <Folder size={16} className="mr-2 text-blue-400" />
                    )}
                    <input
                      ref={inputRef}
                      type="text"
                      className={`bg-transparent border-b border-gray-500 focus:outline-none text-sm ${
                        isDarkTheme ? "text-gray-300" : "text-gray-900"
                      }`}
                      placeholder={`New ${creatingNode.type} name`}
                      onKeyDown={handleCreateNode}
                      onBlur={() => setCreatingNode(null)}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => {
              setSelectedItemId(node.id);
              setActiveFileId(node.id);
            }}
            className={`cursor-pointer w-full flex items-center px-2 py-1 rounded-md hover:bg-gray-700/30 transition-colors ${
              activeFileId === node.id ? "bg-blue-500/20" : ""
            }`}
          >
            {node.language === "html" && (
              <FileCode size={16} className="mr-2 text-purple-500" />
            )}
            {node.language === "javascript" && (
              <FileCode size={16} className="mr-2 text-yellow-500" />
            )}
            {node.language === "css" && (
              <FileType size={16} className="mr-2 text-blue-500" />
            )}
            {node.language === "json" && (
              <FileJson size={16} className="mr-2 text-green-500" />
            )}
            {node.language === "markdown" && (
              <File size={16} className="mr-2 text-gray-400" />
            )}
            {node.language === "text" && (
              <File size={16} className="mr-2 text-gray-400" />
            )}
            <span className="text-sm">{node.name}</span>
          </button>
        )}
      </div>
    );
  };

  // Sidebar collapse state
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const leftPanelRef = useRef<any>(null); // Type as any for imperative API
  const rightPanelRef = useRef<any>(null);

  return (
    <>
      <main
        className={`${montserrat.className} h-screen flex flex-col px-4 ${
          isDarkTheme
            ? "dark bg-[#0e1525] text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <style jsx global>{`
          @keyframes pulse-subtle {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
          }

          .animate-pulse-subtle {
            animation: pulse-subtle 2s infinite;
          }

          .scrollable {
            overflow: auto;
            position: relative;
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
          }

          .scrollable::-webkit-scrollbar {
            width: 20px;
          }

          .scrollable::-webkit-scrollbar-thumb {
            background-color: transparent;
            border-radius: 0;
          }

          .scrollable:hover::-webkit-scrollbar-thumb {
            background-color: rgba(107, 114, 128, 0.4);
          }

          .scrollable::-webkit-scrollbar-track {
            background: transparent;
          }

          .scrollable:hover {
            scrollbar-color: rgba(107, 114, 128, 0.4) transparent;
          }

          .panel-bg {
            background-color: ${isDarkTheme ? "#1f2937" : "#f3f4f6"};
          }
        `}</style>

        <header
          className={`h-12 flex items-center justify-between ${
            isDarkTheme ? "bg-[#0e1525]" : "bg-gray-100/70"
          } transition-colors duration-300 shadow-sm sticky top-0`}
        >
          <div>
            <a href="/">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent flex items-center">
                <Brain size={20} className="mr-2 text-blue-500" />
                LiCoderZ
              </h1>
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center transition-transform hover:scale-105"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                <img
                  title="Upload Your Profile Photo"
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleProfileImageChange}
              accept="image/*"
            />
          </div>
        </header>

        <PanelGroup direction="horizontal" className="flex-1">
          {/* Left Menu */}
          <div className="flex flex-col items-center justify-center gap-6 h-full w-10 transition-all duration-200">
            {/* Explorer Toggle Button */}
            <button
              onClick={() => {
                if (leftPanelRef.current) {
                  if (isLeftCollapsed) {
                    leftPanelRef.current.expand();
                    setIsLeftCollapsed(false); // Panel is now expanded
                  } else {
                    leftPanelRef.current.collapse();
                    setIsLeftCollapsed(true); // Panel is now collapsed
                  }
                }
              }}
              title={isLeftCollapsed ? "Open Explorer" : "Close Explorer"}
              className="cursor-pointer flex items-center"
            >
              {isLeftCollapsed ? (
                <PanelLeftOpen size={20} className="text-blue-500" />
              ) : (
                <PanelLeftClose size={20} className="text-blue-500" />
              )}
            </button>

            {/* Right Panel Toggle */}
            <button
              onClick={() => {
                if (rightPanelRef.current) {
                  if (isRightCollapsed) {
                    rightPanelRef.current.expand();
                    setIsRightCollapsed(false); // Panel is now expanded
                  } else {
                    rightPanelRef.current.collapse();
                    setIsRightCollapsed(true); // Panel is now collapsed
                  }
                }
              }}
              title={isRightCollapsed ? "Open Preview" : "Close Preview"}
              className="cursor-pointer flex items-center"
            >
              {isRightCollapsed ? (
                <Monitor size={20} className="text-blue-500" />
              ) : (
                <MonitorCheck size={20} className="text-blue-500" />
              )}
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="cursor-pointer flex items-center"
              title="Save File"
            >
              <Save size={20} className="mr-2 text-blue-500" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="cursor-pointer flex items-center"
              title="Toggle Theme"
            >
              {isDarkTheme ? (
                <Sun size={20} className="mr-2 text-blue-500" />
              ) : (
                <Moon size={20} className="mr-2 text-blue-500" />
              )}
            </button>
          </div>

          {/* Left Sidebar */}
          <Panel
            ref={leftPanelRef}
            defaultSize={16}
            minSize={16}
            collapsible={true}
            onCollapse={() => setIsLeftCollapsed(true)}
            onExpand={() => setIsLeftCollapsed(false)}
            className="panel-bg"
          >
            <div className="h-full p-3 pt-0">
              <div
                className={`h-10 flex items-center px-3 gap-1 transition-colors duration-200 ${
                  isDarkTheme
                    ? "bg-gray-800/70 border-gray-700"
                    : "bg-gray-100/70 border-gray-200"
                } border-b`}
              >
                <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 flex items-center">
                  <FolderOpen size={16} className="mr-2 text-blue-500" />
                  Explorer
                </h2>
              </div>
              <div
                className={`h-10 flex items-center px-3 gap-1 transition-colors duration-200 ${
                  isDarkTheme
                    ? "bg-gray-800/70 border-gray-700"
                    : "bg-gray-100/70 border-gray-200"
                } backdrop-blur-sm border-b`}
              >
                <button
                  onClick={initiateCreateFolder}
                  className={`p-1.5 rounded-md transition-colors ${
                    isDarkTheme ? "text-green-400" : "text-green-500"
                  } hover:bg-green-500/20 cursor-pointer`}
                  title="Create Folder"
                >
                  <FolderPlus size={16} />
                </button>
                <div
                  className={`h-5 mx-1 w-px ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-300"
                  }`}
                ></div>
                <button
                  onClick={initiateCreateFile}
                  className={`p-1.5 rounded-md transition-colors ${
                    isDarkTheme ? "text-green-400" : "text-green-500"
                  } hover:bg-green-500/20 cursor-pointer`}
                  title="Create File"
                >
                  <FilePlus size={16} />
                </button>
                <div
                  className={`h-5 mx-1 w-px ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-300"
                  }`}
                ></div>
                <button
                  onClick={refreshExplorer}
                  className={`p-1.5 rounded-md transition-colors ${
                    isDarkTheme ? "text-green-400" : "text-green-500"
                  } hover:bg-green-500/20 cursor-pointer`}
                  title="Refresh Explorer"
                >
                  <RefreshCcw size={16} />
                </button>
              </div>
              <div
                className="space-y-2 mt-2 pb-30 h-full scrollable"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedItemId(null);
                }}
              >
                {fileTree.map((node) => (
                  <FileTreeNode key={node.id} node={node} />
                ))}
                {creatingNode && !creatingNode.parentId && (
                  <div className="flex items-center px-2 py-1">
                    {creatingNode.type === "file" ? (
                      <File size={16} className="mr-2 text-gray-400" />
                    ) : (
                      <Folder size={16} className="mr-2 text-blue-400" />
                    )}
                    <input
                      ref={inputRef}
                      type="text"
                      className={`bg-transparent border-b border-gray-500 focus:outline-none text-sm ${
                        isDarkTheme ? "text-gray-300" : "text-gray-900"
                      }`}
                      placeholder={`New ${creatingNode.type} name`}
                      onKeyDown={handleCreateNode}
                      onBlur={() => setCreatingNode(null)}
                    />
                  </div>
                )}
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="w-1 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors z-10" />

          {/* Central Area */}
          <Panel
            defaultSize={40}
            minSize={20}
            className="panel-bg flex flex-col"
          >
            <PanelGroup direction="vertical" className="flex-1">
              <Panel defaultSize={30} minSize={10} className="panel-bg">
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
              <Panel defaultSize={40} minSize={10} className="panel-bg">
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
            className="panel-bg"
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
