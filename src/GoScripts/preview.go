package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
)

// FileItem represents a file object passed from your Electron app.
// Add more fields if needed (e.g., isDirectory, etc.).
type FileItem struct {
	Name        string `json:"name"`
	IsDirectory bool   `json:"isDirectory"`
}

// RenameRule describes a single rename operation (insert, replace, etc.).
type RenameRule struct {
	Type    string                 `json:"type"`    // e.g. "insert", "replace", "changeCase", "truncate"
	Options map[string]interface{} `json:"options"` // dynamic options
}

// PreviewRequest is the top-level JSON input for the preview operation.
type PreviewRequest struct {
	Files []FileItem   `json:"files"`
	Rules []RenameRule `json:"rules"`
}

// PreviewResult holds one file's old/new name result for the preview.
type PreviewResult struct {
	OriginalName string `json:"originalName"`
	NewName      string `json:"newName"`
}

func applyRulesToFilename(original string, rules []RenameRule) string {
	newName := original
	for _, rule := range rules {
		switch rule.Type {
		case "insert":
			newName = applyInsert(newName, rule.Options)
		case "replace":
			newName = applyReplace(newName, rule.Options)
		case "changeCase":
			newName = applyChangeCase(newName, rule.Options)
		case "truncate":
			newName = applyTruncate(newName, rule.Options)
		}
	}
	return newName
}

// Insert operation example
func applyInsert(name string, opts map[string]interface{}) string {
	text, _ := opts["text"].(string)
	if text == "" {
		text = ""
	}
	// Position should be an int; let's parse carefully
	posFloat, ok := opts["position"].(float64)
	if !ok {
		posFloat = 0
	}
	pos := int(posFloat)

	// Guard against out-of-bounds
	if pos < 0 {
		pos = 0
	} else if pos > len(name) {
		pos = len(name)
	}

	return name[:pos] + text + name[pos:]
}

// Replace operation example
func applyReplace(name string, opts map[string]interface{}) string {
	search, _ := opts["search"].(string)
	replaceWith, _ := opts["replaceWith"].(string)
	if search == "" {
		return name
	}
	return strings.ReplaceAll(name, search, replaceWith)
}

// Change case example
func applyChangeCase(name string, opts map[string]interface{}) string {
	caseType, _ := opts["caseType"].(string)
	switch caseType {
	case "upper":
		return strings.ToUpper(name)
	case "lower":
		return strings.ToLower(name)
	case "title":
		// simple approach to Title Case by splitting on spaces
		parts := strings.Fields(strings.ToLower(name))
		for i, p := range parts {
			if len(p) > 0 {
				parts[i] = strings.ToUpper(p[:1]) + p[1:]
			}
		}
		return strings.Join(parts, " ")
	default:
		return name
	}
}

// Truncate example
func applyTruncate(name string, opts map[string]interface{}) string {
	lengthFloat, ok := opts["length"].(float64)
	if !ok {
		lengthFloat = 10
	}
	length := int(lengthFloat)
	if length < 0 {
		length = 0
	}

	from, _ := opts["from"].(string)
	if from == "start" {
		// Keep last N characters
		if len(name) > length {
			return name[len(name)-length:]
		}
		return name
	} else {
		// Default "end": Keep first N characters
		if len(name) > length {
			return name[:length]
		}
		return name
	}
}

func main() {
	// 1. Read all input from stdin
	data, err := io.ReadAll(os.Stdin)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading stdin: %v\n", err)
		os.Exit(1)
	}

	// 2. Parse JSON into a PreviewRequest
	var request PreviewRequest
	if err := json.Unmarshal(data, &request); err != nil {
		fmt.Fprintf(os.Stderr, "Error parsing JSON: %v\n", err)
		os.Exit(1)
	}

	// 3. Apply rules to each file and build a list of results
	var results []PreviewResult
	for _, fileItem := range request.Files {
		newName := applyRulesToFilename(fileItem.Name, request.Rules)
		results = append(results, PreviewResult{
			OriginalName: fileItem.Name,
			NewName:      newName,
		})
	}

	// 4. Print results as JSON to stdout
	out, err := json.Marshal(results)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error marshaling JSON: %v\n", err)
		os.Exit(1)
	}

	fmt.Println(string(out))
}
