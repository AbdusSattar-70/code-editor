import { getTimestamp } from "@/lib/code-editor/get-timestamp";
import {
  Pause,
  Radio,
  SquareArrowOutUpRight,
  TvMinimalPlay,
} from "lucide-react";

interface LivePreviewProps {
  isRunning: boolean;
  debouncedCode: string;
  handleLivePreview: () => void;
  isDarkTheme: boolean;
  setConsoleOutput: React.Dispatch<React.SetStateAction<string[]>>;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  isRunning,
  debouncedCode,
  handleLivePreview,
  isDarkTheme,
  setConsoleOutput,
}) => {
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
          Click &quot;Go Live&quot; to see real-time changes.
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
          <iframe
            title="Live Preview"
            className="h-full w-full"
            sandbox="allow-scripts"
            srcDoc={debouncedCode}
          />
        </div>
      </div>
    </div>
  );
};
