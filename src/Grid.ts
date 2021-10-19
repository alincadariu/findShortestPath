import { Node } from "./Node";
import {
    dijkstra,
    getShortestPath
} from "./dijkstra";
import { MouseInteraction } from "./MouseInteraction";

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
    private _mouseInteraction: MouseInteraction;

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
                    });
                })
            );
            
        this._mouseInteraction = new MouseInteraction({nodes: this._nodes});
        
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

                if (idx === visitedNodesInOrder.length - 1 && shortestPath.length > 0) {
                    this._animateShortestPath(shortestPath);
                    return;
                }

                node.animateVisiting();
            }, 5 * idx);
        });
        this._mouseInteraction.destroy();
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
}