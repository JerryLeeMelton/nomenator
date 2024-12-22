// file: src/GoScripts/rules/logic.go
package rules

import (
	"strings"

	"nomenator-go/common"
)

// ApplyRulesToFilename runs all rules on the original filename
func ApplyRulesToFilename(original string, rules []common.RenameRule) string {
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

func applyInsert(name string, opts map[string]interface{}) string {
	text, _ := opts["text"].(string)
	if text == "" {
		text = ""
	}
	posFloat, ok := opts["position"].(float64)
	if !ok {
		posFloat = 0
	}
	pos := int(posFloat)
	if pos < 0 {
		pos = 0
	} else if pos > len(name) {
		pos = len(name)
	}
	return name[:pos] + text + name[pos:]
}

func applyReplace(name string, opts map[string]interface{}) string {
	search, _ := opts["search"].(string)
	replaceWith, _ := opts["replaceWith"].(string)
	if search == "" {
		return name
	}
	return strings.ReplaceAll(name, search, replaceWith)
}

func applyChangeCase(name string, opts map[string]interface{}) string {
	caseType, _ := opts["caseType"].(string)
	switch caseType {
	case "upper":
		return strings.ToUpper(name)
	case "lower":
		return strings.ToLower(name)
	case "title":
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
		if len(name) > length {
			return name[len(name)-length:]
		}
		return name
	}
	if len(name) > length {
		return name[:length]
	}
	return name
}
