package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"nomenator-go/common"
	"nomenator-go/rules"
)

func main() {
	data, err := io.ReadAll(os.Stdin)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading stdin: %v\n", err)
		os.Exit(1)
	}

	var request common.RenameRequest
	if err := json.Unmarshal(data, &request); err != nil {
		fmt.Fprintf(os.Stderr, "Error parsing JSON: %v\n", err)
		os.Exit(1)
	}

	results := []common.RenameResult{}

	for _, fileItem := range request.Files {
		oldName := fileItem.Name
		newName := rules.ApplyRulesToFilename(oldName, request.Rules)

		oldPath := filepath.Join(request.Directory, oldName)
		newPath := filepath.Join(request.Directory, newName)

		renameResult := common.RenameResult{
			OriginalName: oldName,
			NewName:      newName,
		}

		if err := os.Rename(oldPath, newPath); err != nil {
			renameResult.Status = "error"
			renameResult.ErrorMsg = err.Error()
		} else {
			renameResult.Status = "success"
		}
		results = append(results, renameResult)
	}

	out, err := json.Marshal(results)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error marshaling JSON: %v\n", err)
		os.Exit(1)
	}
	fmt.Println(string(out))
}
