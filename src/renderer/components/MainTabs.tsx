import React from "react"

interface MainTabsProps {
  tabs: string[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const MainTabs: React.FC<MainTabsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="bg-gray-200 p-2 flex space-x-4" id="tabs">
      {tabs.map((tab) => {
        return (
          <button
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-white" : "bg-transparent"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        )
      })}
    </div>
  )
}
