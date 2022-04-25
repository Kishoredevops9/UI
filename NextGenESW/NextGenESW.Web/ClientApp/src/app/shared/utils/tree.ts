export function addAttrToDescendants(node, attrName: string, attrValue: any) {
  node[attrName] = attrValue;
  if (node.children) {
    node.children.forEach(child => addAttrToDescendants(child, attrName, attrValue));
  }
}
