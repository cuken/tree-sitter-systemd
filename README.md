# Tree-sitter Systemd

A Tree-sitter grammar for parsing systemd unit files.

## Features

- Supports basic syntax of systemd unit files
- Distinguishes between different types of sections (such as Service, Mount, Timer, etc.)
- Supports comments and directives

## Validating Sections Based on File Extension

Tree-sitter itself cannot directly access file extensions, so validation logic based on file extensions needs to be implemented in the application using Tree-sitter. Here is an example implementation:

```javascript
function validateSections(tree, filename) {
  const fileType = filename.split('.').pop(); // Get file extension
  const validSections = getValidSectionsForFileType(fileType);
  
  // Traverse all section nodes in the syntax tree
  const sectionNodes = [];
  const cursor = tree.walk();
  
  let foundNode = false;
  do {
    if (cursor.nodeType === 'section') {
      sectionNodes.push(cursor.currentNode());
      foundNode = true;
    }
  } while(cursor.gotoNextSibling() || (foundNode && (foundNode = false, cursor.gotoParent() && cursor.gotoNextSibling())));
  
  // Validate if each section is valid
  const invalidSections = [];
  for (const node of sectionNodes) {
    const sectionNameNode = node.childForFieldName('section_name');
    const sectionName = sectionNameNode.text;
    
    if (!validSections.includes(sectionName)) {
      invalidSections.push({
        name: sectionName,
        position: sectionNameNode.startPosition
      });
    }
  }
  
  return invalidSections;
}

function getValidSectionsForFileType(fileType) {
  // Common sections that can be included in all unit files
  const commonSections = ['Unit', 'Install'];
  
  // Sections specific to certain types of unit files
  const specificSections = {
    'service': ['Service', 'Kill', 'Restart'],
    'mount': ['Mount', 'Automount'],
    'socket': ['Socket', 'SocketActivation'],
    'timer': ['Timer', 'OnCalendar'],
    'path': ['Path', 'PathExists'],
    // More types can be added as needed
  };
  
  return [...commonSections, ...(specificSections[fileType] || [])];
}
```

## Usage

1. Parse systemd unit files using Tree-sitter
2. Get the parsed syntax tree
3. Use the validation function above to check if sections are valid
4. Display errors or warnings based on validation results

## Example

```javascript
const Parser = require('tree-sitter');
const Systemd = require('tree-sitter-systemd');

const parser = new Parser();
parser.setLanguage(Systemd);

const sourceCode = fs.readFileSync('example.service', 'utf8');
const tree = parser.parse(sourceCode);

const invalidSections = validateSections(tree, 'example.service');
if (invalidSections.length > 0) {
  console.error('File contains invalid sections:');
  for (const section of invalidSections) {
    console.error(`- ${section.name} at line ${section.position.row + 1}, column ${section.position.column + 1}`);
  }
}
``` 