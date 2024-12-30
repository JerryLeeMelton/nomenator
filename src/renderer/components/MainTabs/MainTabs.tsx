import React from "react"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { useAppDispatch } from "../../store/hooks"
import "./MainTabs.css"

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
  const dispatch = useAppDispatch()
  const selectedRuleId = useAppSelector(
    (state: RootState) => state.rename.selectedRuleId
  )

  const handleTestButton = () => {
    console.log("Test Button Clicked")
    console.log("selectedRuleId == ", selectedRuleId)
  }

  return (
    <div className="main-tabs  flex space-x-4" id="tabs">
      {tabs.map((tab) => {
        return (
          <button
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "main-tabs-button-active" : "bg-transparent"
            }`}
            onClick={() => setActiveTab(tab)}
            key={`main-tab-${tab}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        )
      })}

      {/* <div className="flex flex-row">
        <button className="test-buttonflex flex-row" onClick={handleTestButton}>
          Test Button
        </button>
      </div> */}
    </div>
  )
}
