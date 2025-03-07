/**
 * @file Tree Sitter support for UNIX systemd unit files
 * @author 10fish <jokefish@live.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "systemd",

  rules: {
    source_file: ($) => repeat($._definition),

    _definition: ($) => choice($.section, $.directive, $.comment, $.blank_line),

    section: ($) => seq("[", $.section_name, "]"),

    section_name: ($) => /[A-Za-z0-9]+/,

    directive: ($) =>
      seq($.key, optional($.whitespace), "=", optional($.whitespace), $.value),

    key: ($) => /[A-Za-z0-9_]+/,

    value: ($) => /[^\n#]+/,

    comment: ($) => seq("#", optional($.whitespace), /[^\n]*/),

    blank_line: ($) => /[\s\t]+/,

    whitespace: ($) => /[ \t]+/,
  },
});
