import * as go from 'gojs';

export type ReorderBorder = {
    part: go.Part,
    border: number,
    start: number,
    isFollowing: boolean
};

export type ReorderSnapshot = {
    shift: number,
    borders: ReorderBorder[],
};

export type Mode = {
    getComputedParts: (parts: go.Part[]) => go.Part[],
    getAxis: (point: go.Point) => number,
    getAllParts: (part: go.Part) => go.Part[],
    getBounds: (rect: go.Rect) => { firstBound: number, secondBound: number },
    getSize: (rect: go.Rect) => number,
    updateParts: (draggedParts: go.Part[], newLocation: number, orderShift: number, part: go.Part) => void,
    dragMouseUp: (diagram: go.Diagram) => void,
    getDraggedParts: (parts: go.Map<go.Part, go.DraggingInfo>) => go.Part[]
};
