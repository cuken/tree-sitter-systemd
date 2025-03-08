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
    source_file: ($) => repeat($.section),

    section: ($) => seq($.section_header, repeat($._definition)),

    _definition: ($) => choice($.directive, $.comment, $.blank_line),

    section_header: ($) => seq("[", $.section_name, "]"),

    section_name: ($) => choice(
      $.common_section,
      $.service_section,
      $.mount_section,
      $.automount_section,
      $.socket_section,
      $.timer_section,
      $.path_section,
      $.slice_section,
      $.swap_section,
      $.scope_section,
    ),

    common_section: ($) => choice(
      "Unit",
      "Install"
    ),

    service_section: ($) => "Service",

    mount_section: ($) => "Mount",

    automount_section: ($) => "Automount",

    socket_section: ($) => "Socket",

    timer_section: ($) => "Timer",

    path_section: ($) => "Path",

    slice_section: ($) => "Slice",

    swap_section: ($) => "Swap",

    scope_section: ($) => "Scope",

    directive: ($) =>
      seq($.key, "=", $.value),

    key: ($) => /[A-Za-z0-9_]+/,

    value: ($) => /.*/,

    comment: ($) => seq("#", /.*/),

    blank_line: ($) => /[\s\t]+/,

    whitespace: ($) => /[ \t]+/,
  },
});
