import { FileNode } from "@/lib/code-editor/file-node";
import { getTimestamp } from "@/lib/code-editor/get-timestamp";
import {
  MonitorCheck,
  MonitorXIcon,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Sun,
} from "lucide-react";
import { toast } from "react-toastify";

interface PanelRef {
  current: {
    collapse: () => void;
    expand: () => void;
  } | null;
}

interface LeftMenuProps {
  leftPanelRef: PanelRef;
  rightPanelRef: PanelRef;
  isLeftCollapsed: boolean;
  isRightCollapsed: boolean;
  setIsLeftCollapsed: (value: boolean) => void;
  setIsRightCollapsed: (value: boolean) => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (value: boolean) => void;
  setConsoleOutput: React.Dispatch<React.SetStateAction<string[]>>;
  activeFile: FileNode | null;
}

export const LeftMenu: React.FC<LeftMenuProps> = ({
  leftPanelRef,
  isLeftCollapsed,
  isRightCollapsed,
  setIsLeftCollapsed,
  setIsRightCollapsed,
  rightPanelRef,
  isDarkTheme,
  setIsDarkTheme,
  activeFile,
  setConsoleOutput,
}) => {
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
    <div className="flex flex-col items-center justify-baseline pt-3 gap-6 h-full w-6 transition-all duration-200">
      {/* Explorer Toggle Button */}
      <button
        onClick={() => {
          if (leftPanelRef.current) {
            if (isLeftCollapsed) {
              leftPanelRef.current.expand();
              setIsLeftCollapsed(false);
            } else {
              leftPanelRef.current.collapse();
              setIsLeftCollapsed(true);
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
              setIsRightCollapsed(false);
            } else {
              rightPanelRef.current.collapse();
              setIsRightCollapsed(true);
            }
          }
        }}
        title={isRightCollapsed ? "Open Preview" : "Close Preview"}
        className="cursor-pointer flex items-center"
      >
        {isRightCollapsed ? (
          <MonitorCheck size={20} className="text-blue-500" />
        ) : (
          <MonitorXIcon size={20} className="text-blue-500" />
        )}
      </button>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="cursor-pointer flex items-center"
        title="Save File"
      >
        <Save size={20} className="text-blue-500" />
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkTheme(!isDarkTheme)}
        className="cursor-pointer flex items-center"
        title="Toggle Theme"
      >
        {isDarkTheme ? (
          <Sun size={20} className="text-blue-500" />
        ) : (
          <Moon size={20} className="text-blue-500" />
        )}
      </button>
    </div>
  );
};
