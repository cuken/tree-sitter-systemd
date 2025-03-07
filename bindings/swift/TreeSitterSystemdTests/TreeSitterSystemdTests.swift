import XCTest
import SwiftTreeSitter
import TreeSitterSystemd

final class TreeSitterSystemdTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_systemd())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Systemd grammar")
    }
}
