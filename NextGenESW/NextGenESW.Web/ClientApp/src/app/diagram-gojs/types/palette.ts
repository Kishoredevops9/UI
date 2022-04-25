import { NodeCategory, NodeType } from './node';

export interface PaletteItem {
    category: NodeCategory;
    type: NodeType;
    text: string;
}
