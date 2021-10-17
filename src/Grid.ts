import { NodeElement } from "./Node";
import { dijkstra, getNodesInShortestPathOrder } from "./dijkstra";

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
        const button = document.createElement('button');
        const buttonText = document.createElement('p');
        button.classList.add('button');
        buttonText.classList.add('buttonText');
        buttonText.textContent = 'Find shortest path';
        button.appendChild(buttonText);
        parent.appendChild(button);
        button.addEventListener('click', this._animate);
        parent.appendChild(this._gridElement);
    }

    private _animate = () => {
        const startNode = this._getStartNode();
        const destinationNode = this._getDestinationNode();
        const visitedNodesInOrder = dijkstra(this._nodes, startNode, destinationNode) as NodeElement[];
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(destinationNode);
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this._animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }

            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (i === 0 || i === visitedNodesInOrder.length - 1) {
                    return;
                }
                node.setVisitingClass();
            }, 10 * i);
        }
    }

    private _animateShortestPath(nodesInShortestPathOrder: NodeElement[]) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                if (i === 0 || i === nodesInShortestPathOrder.length - 1) {
                    return;
                }
                node.setShortClass();
            }, 100 * i);
        }
    }

    private _getStartNode = () => {
        return this._nodes.flatMap(row => row).filter(({ isStartNode }) => isStartNode)[0];
    }

    private _getDestinationNode = () => {
        return this._nodes.flatMap(row => row).filter(({ isDestinationNode }) => isDestinationNode)[0];
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