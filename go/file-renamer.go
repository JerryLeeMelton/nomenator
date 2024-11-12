package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) != 3 {
		fmt.Println("Usage: file-renamer <oldPath> <newPath>")
		return
	}

	oldPath := os.Args[1]
	newPath := os.Args[2]

	err := os.Rename(oldPath, newPath)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	fmt.Println("Renaming successful")
}
