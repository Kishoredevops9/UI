import { FlatTreeControl } from "@angular/cdk/tree";

export function includeText(target: string, text: string): boolean {
  if (!text) return true;
  if (!target) return false;
  return target.toLowerCase().includes(text.toLowerCase());
}

export function filterLeafNode(filterText: string, node: any, prop: string): boolean {
  if (!filterText) return true;
  if (!node[prop]) return false;
  return node[prop].toLowerCase().includes(filterText.toLowerCase())
}

export function filterParentNode(
  filterText: string,
  node: any,
  prop: string,
  treeControl: FlatTreeControl<any>
): boolean {
  const okParentNode = includeText(node[prop], filterText);
  
  if (okParentNode) return true;

  const descendants = treeControl.getDescendants(node);

  return !!descendants.find(des => includeText(des[prop], filterText))
}

// filter recursively on a text string using property object value
export function filterRecursive(filterText: string, array: any[], property: string) {
  let filteredData;

  //make a copy of the data so we don't mutate the original
  function copy(o: any) {
    return Object.assign({}, o);
  }

  // has string
  if (filterText) {
    // need the string to match the property value
    filterText = filterText.toLowerCase();
    // copy obj so we don't mutate it and filter
    filteredData = array.map(copy).filter(function x(y) {
      if (y[property].toLowerCase().includes(filterText)) {
        return true;
      }
      // if children match
      if (y.children) {
        return (y.children = y.children.map(copy).filter(x)).length;
      }
    });
    // no string, return whole array
  } else {
    filteredData = array;
  }

  return filteredData;
}