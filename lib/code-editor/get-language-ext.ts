export const getLanguageFromExtension = (filename: string): string => {
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
