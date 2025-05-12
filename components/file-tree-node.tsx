import { FileNode } from "@/lib/file-node";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  FileCode,
  FileType,
  FileJson,
} from "lucide-react";
import { Poppins } from "next/font/google";
import { KeyboardEvent, MutableRefObject } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

interface CreatingNode {
  type: "file" | "folder";
  parentId: string | null;
}

interface FileTreeNodeProps {
  node: FileNode;
  depth?: number;
  expandedFolders: string[];
  toggleFolder: (id: string) => void;
  selectedItemId: string | null;
  setSelectedItemId: (value: string | null) => void;
  activeFileId: string | null;
  creatingNode: CreatingNode | null;
  handleCreateNode: (e: KeyboardEvent<HTMLInputElement>) => void;
  setCreatingNode: (value: CreatingNode | null) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  isDarkTheme: boolean;
  setActiveFileId: (id: string) => void;
}

export const FileTreeNode = ({
  node,
  depth = 0,
  expandedFolders,
  toggleFolder,
  selectedItemId,
  setSelectedItemId,
  activeFileId,
  creatingNode,
  handleCreateNode,
  setCreatingNode,
  inputRef,
  isDarkTheme,
  setActiveFileId,
}: FileTreeNodeProps) => {
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
          {["markdown", "text"].includes(node.language ?? "") && (
            <File size={16} className="mr-2 text-gray-400" />
          )}
          <span className="text-sm">{node.name}</span>
        </button>
      )}
    </div>
  );
};
