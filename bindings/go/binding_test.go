package tree_sitter_systemd_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_systemd "github.com/10fish/tree-sitter-systemd/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_systemd.Language())
	if language == nil {
		t.Errorf("Error loading Systemd grammar")
	}
}
