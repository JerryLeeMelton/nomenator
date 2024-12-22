package common

type FileItem struct {
	Name        string `json:"name"`
	IsDirectory bool   `json:"isDirectory"`
}

type RenameRule struct {
	Type    string                 `json:"type"`
	Options map[string]interface{} `json:"options"`
}

type RenameRequest struct {
	Directory string       `json:"directory"`
	Files     []FileItem   `json:"files"`
	Rules     []RenameRule `json:"rules"`
}

type RenameResult struct {
	OriginalName string `json:"originalName"`
	NewName      string `json:"newName"`
	Status       string `json:"status"` // "success" or "error"
	ErrorMsg     string `json:"errorMsg,omitempty"`
}
