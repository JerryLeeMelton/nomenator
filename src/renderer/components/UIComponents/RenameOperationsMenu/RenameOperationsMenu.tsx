import React, { ReactElement, useEffect, useRef, useState } from "react"
import "./RenameOperationsMenu.css"
import { mdiChevronDown, mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"

export interface RenameOperationMenuOption {
  key: string
  label: string
}

interface RenameOperationsMenuProps {
  width: number
  height: number
  headerLabel: string
  optionsList: RenameOperationMenuOption[]
  disabled?: boolean
  dropdownLabel?: string
  onSelect: (option: RenameOperationMenuOption) => void

  cssID?: string
}

export const RenameOperationsMenu = ({
  width,
  height,
  headerLabel,
  optionsList,
  disabled = false,
  dropdownLabel,
  onSelect,
  cssID,
}: RenameOperationsMenuProps): ReactElement => {
  const [isListOpen, setIsListOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLButtonElement>(null)

  // const containerWidth = `${width}px`
  const containerWidth = `$100%`
  const containerHeight = `${height}px`

  const handleHeaderClick = () => {
    if (disabled) return

    setIsListOpen((prev) => !prev)

    const wrapperRect = menuRef.current?.getBoundingClientRect()
    if (wrapperRect && dropdownRef.current) {
      dropdownRef.current.style.top = `${wrapperRect.bottom}px`
      dropdownRef.current.style.left = `${wrapperRect.left}px`
      dropdownRef.current.style.width = `${wrapperRect.width}px`
    }
  }

  const handleOptionClick = (option: RenameOperationMenuOption) => {
    setIsListOpen(false)
    onSelect(option)
  }

  // Close the dropdown if the user clicks outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsListOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={menuRef}
      id={cssID}
      className="dropdown-wrapper"
      style={{ position: "relative" }}
    >
      {dropdownLabel && <p className="dropdown-label">{dropdownLabel}</p>}

      <span style={{ position: "relative" }}>
        <button
          type="button"
          className={`dropdown-header ${disabled ? "dropdown-disabled" : ""}`}
          onClick={handleHeaderClick}
          ref={headerRef}
          style={{ width: containerWidth, height: containerHeight }}
        >
          <span className="dropdown-header-title">{headerLabel}</span>
          <span className={"icon mdi dropdown-plus"}>
            <Icon path={mdiPlus} size={1} />
          </span>
        </button>

        {/* Dropdown List */}
        <div
          role="list"
          className={
            isListOpen
              ? "dropdown-list-container"
              : "dropdown-list-container hidden"
          }
          ref={dropdownRef}
          // style={{ width: containerWidth }}
        >
          {optionsList.map((option, index) => (
            <button
              type="button"
              className="dropdown-list-item"
              id={`dropdown-menu-${index}-${option.key}`}
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{ height: containerHeight }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </span>
    </div>
  )
}
