import React from "react"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"

export const SelectedFilesTable: React.FC = () => {
  const selectedFiles = useAppSelector(
    (state: RootState) => state.files.selectedFiles
  )

  if (selectedFiles.length === 0) {
    return <p>No files selected.</p>
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Selected Files</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-100">
            <th className="text-left p-2">Original Name</th>
            <th className="text-left p-2">New Name</th>
          </tr>
        </thead>
        <tbody>
          {selectedFiles.map((fileName) => (
            <tr key={fileName} className="border-b border-gray-200">
              <td className="p-2">{fileName}</td>
              <td className="p-2 text-gray-600">{fileName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
