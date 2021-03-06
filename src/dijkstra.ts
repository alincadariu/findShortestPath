// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
import { Node } from "./Node";

export const dijkstra = (grid: Node[][], startNode: Node, destinationNode: Node) => {
    const visitedNodesInOrder: Node[] = [];
    startNode.setDistance(0);
    const unvisitedNodes = grid.flatMap(node => node);
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift() as Node;

        if (closestNode.isWallNode) continue;

        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.setVisited(true);
        visitedNodesInOrder.push(closestNode);

        if (closestNode === destinationNode) return visitedNodesInOrder;

        updateUnvisitedNeighbors(closestNode, grid);
    }
}

const sortNodesByDistance = (unvisitedNodes: Node[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

const updateUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    unvisitedNeighbors.forEach((neighbor) => {
        neighbor.setDistance(node.distance + 1);
        neighbor.setPreviousNode(node);
    });
}

const getUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
    const neighbors: Node[] = [];
    const { column, row } = node.position;
    if (row > 0) neighbors.push(grid[row - 1][column]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][column]);
    if (column > 0) neighbors.push(grid[row][column - 1]);
    if (column < grid[0].length - 1) neighbors.push(grid[row][column + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export const getShortestPath = (destinationNode: Node) => {
    const path: Node[] = [];

    if (destinationNode.previousNode == null) {
        return path;
    }

    let currentNode: Node | null = destinationNode;
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return path;
}