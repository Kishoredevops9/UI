import * as  _ from 'lodash';

interface SearchTreeOptions {
  labelField?: string
}

function isOKNode(searchText: string, node: any, options: SearchTreeOptions = { labelField: 'label' }) {
  // BusinessLogic
  // Search behavior as following:
  // - If parent node's label contains searchText => return it and all children
  // - If a leaf node contains searchText => return it from root node
  if (node[options.labelField].toLocaleLowerCase().includes(searchText)) return true;
  if (!node.children || !node.children.length) return false;

  const okChildren = node.children.filter(child => isOKNode(searchText, child, options))
  if (okChildren.length) {
    node.children = okChildren;
    return true
  }

  return false
}

/**
   * 
   * @param _searchText Keyword entered by user; should be in lower case already
   * @param _treeNodes Input list of tree nodes. If tree has rootNode => pass [rootNode]
   * @returns List of tree nodes that favorable search behavior described inside the function
   */
export function searchTree(_searchText, _treeNodes: any[], options: SearchTreeOptions = { labelField: 'label' } ) {
  // Node's children could be modifed during to the
  // search process. Need to make a deep clone of input 
  // node list. Using loadash or json.parse(json.stringify)
  const clonedTreeNodes = _.cloneDeep(_treeNodes);
  const searchText = _searchText && _searchText.toLocaleLowerCase();
  const filteredNodes = clonedTreeNodes.filter(node => isOKNode(searchText, node, options));
  return filteredNodes;
}