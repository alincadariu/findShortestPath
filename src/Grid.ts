import { Node } from "./Node";
import {
    dijkstra,
    getShortestPath
} from "./dijkstra";

type GridProps = {
    startNode: number[];
    destinationNode: number[];
    rowsLength: number;
    columnsLength: number;
    parent: HTMLDivElement;
}

export class Grid {
    private _nodes: Node[][];
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

                    return new Node({
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

        const button = document.getElementById('button') as HTMLDivElement;
        button.addEventListener('click', this._animate);
        parent.appendChild(this._gridElement);
    }

    private _animate = () => {
        const startNode = this._getStartNode();
        const destinationNode = this._getDestinationNode();
        const visitedNodesInOrder = dijkstra(this._nodes, startNode, destinationNode) as Node[];
        const shortestPath = getShortestPath(destinationNode);
        visitedNodesInOrder.forEach((node, idx) => {
            setTimeout(() => {
                if (idx === 0) {
                    return;
                }

                if (idx === visitedNodesInOrder.length - 1) {
                    this._animateShortestPath(shortestPath);
                    return;
                }
                
                node.animateVisiting();
            }, 5 * idx);
        });
    }

    private _animateShortestPath(path: Node[]) {
        path.forEach((node, idx) => {
            setTimeout(() => {
                if (idx === 0) {
                    return;
                }
                node.animateShortest();
            }, 50 * idx);
        });
    }

    private _getStartNode = () => {
        return this._nodes.flatMap(row => row.filter(({ isStartNode }) => isStartNode))[0];
    }

    private _getDestinationNode = () => {
        return this._nodes.flatMap(row => row.filter(({ isDestinationNode }) => isDestinationNode))[0];
    }

    private _onMouseDown = (node: Node) => {
        this._isDraggingSpecialNode = node.isSpecialNode;
        if (this._isDraggingSpecialNode) {
            this._typeSpecialNode = node.isStartNode
                ? 'start'
                : 'destination';
        }
        this._isDragging = true;
    }

    private _onMouseEnter = (node: Node) => {
        if (!this._isDragging) {
            return;
        }

        this._isDraggingSpecialNode
            ? this._setSpecialNode(node)
            : node.setWallNode();
    }

    private _onMouseLeave = (node: Node) => {
        if (!(this._isDragging && this._isDraggingSpecialNode)) {
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
}