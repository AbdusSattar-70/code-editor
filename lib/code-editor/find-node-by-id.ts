import { FileNode } from "./file-node";

export const findNodeById = (
  nodes: FileNode[],
  id: string
): FileNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.type === "folder" && node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};
