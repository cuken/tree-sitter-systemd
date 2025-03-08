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

    section_name: ($) => choice(
      $.common_section,
      $.service_section,
      $.mount_section,
      $.socket_section,
      $.timer_section,
      $.path_section,
      /[A-Za-z0-9]+/
    ),

    common_section: ($) => choice(
      "Unit",
      "Install"
    ),

    service_section: ($) => choice(
      "Service",
      "Kill",
      "Restart"
    ),

    mount_section: ($) => choice(
      "Mount",
      "Automount"
    ),

    socket_section: ($) => choice(
      "Socket",
      "SocketActivation"
    ),

    timer_section: ($) => choice(
      "Timer",
      "OnCalendar"
    ),

    path_section: ($) => choice(
      "Path",
      "PathExists"
    ),

    directive: ($) =>
      seq($.key, "=", $.value),

    key: ($) => /[A-Za-z0-9_]+/,

    value: ($) => /[^\n#]+/,

    comment: ($) => seq("#", optional($.whitespace), /[^\n]*/),

    blank_line: ($) => /[\s\t]+/,

    whitespace: ($) => /[ \t]+/,
  },
});
