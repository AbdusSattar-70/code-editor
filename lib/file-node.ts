export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  content?: string;
  breakpoints?: number[];
  children?: FileNode[];
};
