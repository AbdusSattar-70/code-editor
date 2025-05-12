import { Pause, Radio } from "lucide-react";

interface LivePreviewProps {
  isRunning: boolean;
  debouncedCode: string;
  handleLivePreview: () => void;
  isDarkTheme: boolean;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
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
