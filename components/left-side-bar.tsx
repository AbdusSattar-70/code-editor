import { FileNode } from "@/lib/file-node";
import { getTimestamp } from "@/lib/get-timestamp";
import {
  FilePlus,
  Folder,
  FolderOpen,
  FolderPlus,
  RefreshCcw,
  File as FileIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FileTreeNode } from "./file-tree-node";
import { getLanguageFromExtension } from "@/lib/get-language-ext";

interface LeftSideBarProps {
  fileTree: FileNode[];
  setFileTree: React.Dispatch<React.SetStateAction<FileNode[]>>;
  findNodeById: (nodes: FileNode[], id: string) => FileNode | null;
  setConsoleOutput: React.Dispatch<React.SetStateAction<string[]>>;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  isDarkTheme: boolean;
  activeFileId: string | null;
  setActiveFileId: (id: string) => void;
}

export const LeftSideBar = ({
  fileTree,
  setFileTree,
  findNodeById,
  setConsoleOutput,
  selectedItemId,
  setSelectedItemId,
  isDarkTheme,
  activeFileId,
  setActiveFileId,
}: LeftSideBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [creatingNode, setCreatingNode] = useState<{
    type: "file" | "folder";
    parentId: string | null;
  } | null>(null);

  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    "html-boilerplate",
  ]);

  const addNode = (newNode: FileNode, parentId: string | null) => {
    setFileTree((prevTree) => {
      if (!parentId) {
        return [...prevTree, newNode];
      } else {
        const updatedTree = structuredClone(prevTree); // safer deep clone
        const parentNode = findNodeById(updatedTree, parentId);
        if (parentNode && parentNode.type === "folder") {
          parentNode.children = parentNode.children || [];
          parentNode.children.push(newNode);
        }
        return updatedTree;
      }
    });
  };

  const handleCreateNode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current || !creatingNode) return;

    if (e.key === "Enter") {
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

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

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

  const initiateCreateNode = (type: "file" | "folder") => {
    let parentId: string | null = null;
    if (selectedItemId) {
      const selectedNode = findNodeById(fileTree, selectedItemId);
      if (selectedNode) {
        if (selectedNode.type === "folder") {
          parentId = selectedNode.id;
          toggleFolder(parentId);
        } else {
          const parentNode = findParentNode(fileTree, selectedNode.id);
          parentId = parentNode ? parentNode.id : null;
        }
      }
    }
    setCreatingNode({ type, parentId });
  };

  const refreshExplorer = () => {
    const message = `${getTimestamp()} Explorer refreshed`;
    toast.info(message);
    setConsoleOutput((prev) => [...prev, message]);
  };

  return (
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
          onClick={() => initiateCreateNode("folder")}
          className={`p-1.5 rounded-md transition-colors ${
            isDarkTheme ? "text-green-400" : "text-green-500"
          } hover:bg-green-500/20`}
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
          onClick={() => initiateCreateNode("file")}
          className={`p-1.5 rounded-md transition-colors ${
            isDarkTheme ? "text-green-400" : "text-green-500"
          } hover:bg-green-500/20`}
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
          } hover:bg-green-500/20`}
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
          <FileTreeNode
            key={node.id}
            node={node}
            depth={0}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            activeFileId={activeFileId}
            creatingNode={creatingNode}
            handleCreateNode={handleCreateNode}
            setCreatingNode={setCreatingNode}
            inputRef={inputRef}
            isDarkTheme={isDarkTheme}
            setActiveFileId={setActiveFileId}
          />
        ))}

        {creatingNode && !creatingNode.parentId && (
          <div className="flex items-center px-2 py-1">
            {creatingNode.type === "file" ? (
              <FileIcon size={16} className="mr-2 text-gray-400" />
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
  );
};
