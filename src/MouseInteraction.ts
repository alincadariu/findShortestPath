import { Node } from "./Node";

type MouseInteractionProps = {
    nodes: Node[][];
}
export class MouseInteraction {
    private _nodes: Node[][];
    private _isDragging: boolean = false;
    private _isDraggingSpecialNode: boolean = false;
    private _typeSpecialNode: 'start' | 'destination' | null = null;

    constructor({
        nodes
    }: MouseInteractionProps){
        this._nodes = nodes;

        this._nodes.flatMap(row => row.forEach(node => {
            node.element.addEventListener('mousedown', this._onMouseDown);
            node.element.addEventListener('mouseenter', this._onMouseEnter);
            node.element.addEventListener('mouseup', this._onMouseUp);
            node.element.addEventListener('mouseleave', this._onMouseLeave);
        }));
    }

    public destroy() {
        this._nodes.flatMap(row => row.forEach(node => {
            node.element.removeEventListener('mousedown', this._onMouseDown);
            node.element.removeEventListener('mouseenter', this._onMouseEnter);
            node.element.removeEventListener('mouseup', this._onMouseUp);
            node.element.removeEventListener('mouseleave', this._onMouseLeave);
        }));
    }

    private _onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        const node = this._mapTargetToNode(e.currentTarget as HTMLDivElement);

        this._isDraggingSpecialNode = node.isSpecialNode;
        if (this._isDraggingSpecialNode) {
            this._typeSpecialNode = node.isStartNode
                ? 'start'
                : 'destination';
        }
        this._isDragging = true;
    }

    private _onMouseEnter = (e: MouseEvent) => {
        const node = this._mapTargetToNode(e.currentTarget as HTMLDivElement);

        if (!this._isDragging) {
            return;
        }

        if (node.isSpecialNode && !this._isDraggingSpecialNode){
            return;
        }

        this._isDraggingSpecialNode
            ? this._setSpecialNode(node)
            : node.setWallNode();
    }

    private _onMouseLeave = (e: MouseEvent) => {
        const node = this._mapTargetToNode(e.currentTarget as HTMLDivElement);

        if (!(this._isDragging && this._isDraggingSpecialNode && node.isSpecialNode)) {
            return;
        }

        this._removeSpecialNode(node);
    }

    private _onMouseUp = () => {
        this._isDragging = false;
    }

    private _setSpecialNode = (node: Node) => {
        this._typeSpecialNode === 'start'
            ? node.setStartNode()
            : node.setDestinationNode();
    }

    private _removeSpecialNode = (node: Node) => {
        this._typeSpecialNode === 'start'
            ? node.removeStartNode()
            : node.removeDestinationNode();
    }

    private _mapTargetToNode = (target: HTMLDivElement) => {
        const row = parseInt(target.dataset.row as string);
        const column = parseInt(target.dataset.column as string);
        return this._nodes[row][column];
    }
}