import { useState } from "react";

interface BottomPanelProps {
  isDarkTheme: boolean;
  terminalOutput: string[];
  consoleOutput: string[];
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  isDarkTheme,
  terminalOutput,
  consoleOutput,
}) => {
  const [activeTab, setActiveTab] = useState("console");

  const tabs = [
    { key: "console", label: "Console" },
    { key: "terminal", label: "Terminal" },
    { key: "problems", label: "Problems" },
  ];

  const getTabButtonClass = (tabKey: string) => {
    const base =
      "px-4 py-2 text-sm font-medium transition-colors cursor-pointer";
    const active = activeTab === tabKey;
    return `${base} ${
      active
        ? isDarkTheme
          ? "border-b-2 border-blue-500 text-blue-400"
          : "border-b-2 border-blue-600 text-blue-600"
        : isDarkTheme
        ? "text-gray-400 hover:text-gray-300"
        : "text-gray-600 hover:text-gray-800"
    }`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-gray-700 scrollable">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={getTabButtonClass(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 scrollable">
        <div className="p-2 text-sm h-full">
          {["terminal", "console"].includes(activeTab) && (
            <>
              {(activeTab === "terminal" ? terminalOutput : consoleOutput).map(
                (line, index) => (
                  <div
                    key={index}
                    className={isDarkTheme ? "text-gray-300" : "text-gray-800"}
                  >
                    {line}
                  </div>
                )
              )}
              <div className="flex items-center mt-1">
                <span
                  className={`mr-2 ${
                    isDarkTheme ? "text-green-400" : "text-green-600"
                  }`}
                >
                  $
                </span>
                <input
                  type="text"
                  className={`flex-1 bg-transparent border-none outline-none ${
                    isDarkTheme ? "text-gray-300" : "text-gray-800"
                  }`}
                  placeholder="Type a command..."
                />
              </div>
            </>
          )}

          {activeTab === "problems" && (
            <p className={isDarkTheme ? "text-gray-300" : "text-gray-800"}>
              $ No problems detected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
