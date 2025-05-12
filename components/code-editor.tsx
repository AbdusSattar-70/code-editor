import { getTimestamp } from "@/lib/get-timestamp";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Editor from "@monaco-editor/react";
import { Fira_Code } from "next/font/google";
import { findNodeById } from "@/lib/find-node-by-id";
import { FileNode } from "@/lib/file-node";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

interface CodeEditorProps {
  activeFile: FileNode | null;
  setCode: (code: string) => void;
  activeFileId: string | null;
  setFileTree: React.Dispatch<React.SetStateAction<FileNode[]>>;
  setConsoleOutput: React.Dispatch<React.SetStateAction<string[]>>;
  fileTree: FileNode[];
  setActiveFileId: (id: string) => void;
  setSelectedItemId: (id: string) => void;
  isDarkTheme: boolean;
  handleLivePreview: () => void;
  isRunning: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  activeFile,
  setCode,
  activeFileId,
  setFileTree,
  setConsoleOutput,
  fileTree,
  setActiveFileId,
  setSelectedItemId,
  isDarkTheme,
  handleLivePreview,
  isRunning,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [executionSteps, setExecutionSteps] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      line: i + 1,
    }))
  );

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

  return (
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
                <FileCode size={14} className="mr-1 text-yellow-500" />
              )}
              {file.language === "css" && (
                <FileType size={14} className="mr-1 text-blue-500" />
              )}
              {file.language === "json" && (
                <FileJson size={14} className="mr-1 text-green-500" />
              )}
              {file.language === "markdown" && (
                <File size={14} className="mr-1 text-green-500" />
              )}
              {file.language === "text" && (
                <FileText size={14} className="mr-1 text-green-500" />
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
          title={isRunning ? "Pause Live" : "Run the Code to Go Live"}
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
            <div className="p-4 text-gray-500">No file selected</div>
          )}
        </div>
      </div>
    </div>
  );
};
