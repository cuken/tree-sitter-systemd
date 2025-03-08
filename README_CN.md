# Tree-sitter Systemd

[English🇺🇸](README.md) | [简体中文🇨🇳](README_CN.md)

这是一个用于解析systemd单元文件的Tree-sitter语法。

## 特性

- 支持systemd单元文件的基本语法
- 区分不同类型的section（如Service、Mount、Timer等）
- 支持注释和指令

## 根据文件扩展名验证section

Tree-sitter本身不能直接访问文件扩展名，因此需要在使用Tree-sitter的应用程序中实现基于文件扩展名的验证逻辑。以下是一个示例实现：

```javascript
function validateSections(tree, filename) {
  const fileType = filename.split('.').pop(); // 获取文件扩展名
  const validSections = getValidSectionsForFileType(fileType);
  
  // 遍历语法树中的所有section节点
  const sectionNodes = [];
  const cursor = tree.walk();
  
  let foundNode = false;
  do {
    if (cursor.nodeType === 'section') {
      sectionNodes.push(cursor.currentNode());
      foundNode = true;
    }
  } while(cursor.gotoNextSibling() || (foundNode && (foundNode = false, cursor.gotoParent() && cursor.gotoNextSibling())));
  
  // 验证每个section是否有效
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
  // 所有单元文件都可以包含的通用section
  const commonSections = ['Unit', 'Install'];
  
  // 特定类型单元文件可以包含的section
  const specificSections = {
    'service': ['Service', 'Kill', 'Restart'],
    'mount': ['Mount', 'Automount'],
    'socket': ['Socket', 'SocketActivation'],
    'timer': ['Timer', 'OnCalendar'],
    'path': ['Path', 'PathExists'],
    // 可以根据需要添加更多类型
  };
  
  return [...commonSections, ...(specificSections[fileType] || [])];
}
```

## 使用方法

1. 使用Tree-sitter解析systemd单元文件
2. 获取解析后的语法树
3. 使用上述验证函数检查section是否有效
4. 根据验证结果显示错误或警告

## 示例

```javascript
const Parser = require('tree-sitter');
const Systemd = require('tree-sitter-systemd');

const parser = new Parser();
parser.setLanguage(Systemd);

const sourceCode = fs.readFileSync('example.service', 'utf8');
const tree = parser.parse(sourceCode);

const invalidSections = validateSections(tree, 'example.service');
if (invalidSections.length > 0) {
  console.error('文件包含无效的section:');
  for (const section of invalidSections) {
    console.error(`- ${section.name} at line ${section.position.row + 1}, column ${section.position.column + 1}`);
  }
}
``` 