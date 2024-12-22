// file: src/GoScripts/preview.go
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"

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

	type PreviewResult struct {
		OriginalName string `json:"originalName"`
		NewName      string `json:"newName"`
	}
	results := []PreviewResult{}

	for _, fileItem := range request.Files {
		newName := rules.ApplyRulesToFilename(fileItem.Name, request.Rules)
		results = append(results, PreviewResult{
			OriginalName: fileItem.Name,
			NewName:      newName,
		})
	}

	out, err := json.Marshal(results)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error marshaling JSON: %v\n", err)
		os.Exit(1)
	}
	fmt.Println(string(out))
}
