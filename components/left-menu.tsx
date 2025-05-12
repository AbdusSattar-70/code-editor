import {
  MonitorCheck,
  MonitorXIcon,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Sun,
} from "lucide-react";

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
  handleSave: () => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (value: boolean) => void;
}

export const LeftMenu: React.FC<LeftMenuProps> = ({
  leftPanelRef,
  isLeftCollapsed,
  isRightCollapsed,
  setIsLeftCollapsed,
  setIsRightCollapsed,
  handleSave,
  rightPanelRef,
  isDarkTheme,
  setIsDarkTheme,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full w-10 transition-all duration-200">
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
          <MonitorXIcon size={20} className="text-blue-500" />
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
  );
};
