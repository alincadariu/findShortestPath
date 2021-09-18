import { fromEvent, map, mergeMap, Observable, Observer, of, takeUntil } from "rxjs";
import { NodeElement } from "./Node";

type GridProps = {
    startNode: number[];
    destinationNode: number[];
    rowsLength: number;
    columnsLength: number;
    parent: HTMLDivElement;
}

export class Grid {
    private _nodes: NodeElement[][];
    private _gridElement: HTMLDivElement;
    private _isDragging: boolean = false;
    private _isDraggingSpecialNode: boolean = false;
    private _typeSpecialNode: 'start' | 'destination' | null = null;

    constructor({
        startNode,
        destinationNode,
        rowsLength,
        columnsLength,
        parent,
    }: GridProps) {
        this._gridElement = document.createElement('div');
        this._gridElement.classList.add('grid');

        this._nodes = Array.from({ length: rowsLength })
            .map((_, rowIndex) => Array.from({ length: columnsLength })
                .map((_, columnIndex) => {
                    const isStartNode = rowIndex === startNode[0] && columnIndex === startNode[1];
                    const isDestinationNode = rowIndex === destinationNode[0] && columnIndex === destinationNode[1];

                    return new NodeElement({
                        position: {
                            row: rowIndex,
                            column: columnIndex
                        },
                        isStartNode,
                        isDestinationNode,
                        grid: this._gridElement,
                        onMouseDown: this._onMouseDown,
                        onMouseUp: this._onMouseUp,
                        onMouseEnter: this._onMouseEnter,
                        onMouseLeave: this._onMouseLeave,
                    });
                }));

        parent.appendChild(this._gridElement);
    }

    private _onMouseDown = (node: NodeElement) => {
        this._isDraggingSpecialNode = node.isSpecialNode;
        if (this._isDraggingSpecialNode) {
            this._typeSpecialNode = node.isStartNode
                ? 'start'
                : 'destination';
        }
        this._isDragging = true;
    }

    private _onMouseEnter = (node: NodeElement) => {
        if (!this._isDragging) {
            return;
        }

        this._isDraggingSpecialNode
            ? this._setSpecialNode(node)
            : node.setWallNode();
    }

    private _onMouseLeave = (node: NodeElement) => {
        if (!(this._isDragging && this._isDraggingSpecialNode)) {
            return;
        }
        this._removeSpecialNode(node);
    }

    private _onMouseUp = (node: NodeElement) => {
        this._isDragging = false;
    }

    private _setSpecialNode = (node: NodeElement) => {
        this._typeSpecialNode === 'start'
            ? node.setStartNode()
            : node.setDestinationNode();
    }

    private _removeSpecialNode = (node: NodeElement) => {
        this._typeSpecialNode === 'start'
            ? node.removeStartNode()
            : node.removeDestinationNode();
    }
}