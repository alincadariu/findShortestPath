import { distinct, filter, fromEvent, map, mergeMap, pairwise, takeUntil, tap } from "rxjs";
import { Node } from "./Node";

type MouseInteractionProps = {
    parent: HTMLDivElement;
    nodes: Node[][];
}
export class ClassicMouseInteraction {
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
        this._isDragging = true;

        this._isDraggingSpecialNode = node.isSpecialNode;
        if (this._isDraggingSpecialNode) {
            this._typeSpecialNode = node.isStartNode
                ? 'start'
                : 'destination';
            return;
        }
        node.setWallNode();
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

const mapTargetToNode = (e: Event, nodes: Node[][]) => {
    const target = e.target as HTMLDivElement;
    const row = parseInt(target.dataset.row as string);
    const column = parseInt(target.dataset.column as string);
    return nodes[row][column];
}

const assignNodeType = (prevNode: Node, currNode: Node) => {
    // clashing is not handled yet

    if (prevNode.isWallNode && !currNode.isSpecialNode) {
        currNode.setWallNode();
        return;
    }

    if (prevNode.isSpecialNode && !currNode.isSpecialNode) {
        prevNode.isStartNode
            ? currNode.setStartNode()
            : currNode.setDestinationNode();

        prevNode.setNormalNode();
    }
}

const setInitial = (node: Node) => {
    if (node.isSpecialNode) {
        return;
    }
    node.setWallNode();
}

const nodeClass = (ev: Event) => {
    return (ev.target as HTMLDivElement).classList.contains('node');
}

export const ObservableMouseInteraction = ({
    parent, 
    nodes,
}: MouseInteractionProps) => {
    const onMouseDown$ = fromEvent(parent, 'mousedown');
    const onMouseUp$ = fromEvent(parent, 'mouseup');
    const onMouseMove$ = fromEvent(parent, 'mousemove');

    const interaction$ = onMouseDown$.pipe(
        tap(e => e.preventDefault()),
        filter(e => nodeClass(e)),
        map(e => mapTargetToNode(e, nodes)),
        map(node => setInitial(node)),
        mergeMap(_ => onMouseMove$.pipe(
                distinct(e => e.target),
                filter(e => nodeClass(e)),
                pairwise(),
                map(([prev, curr]) => [
                    mapTargetToNode(prev, nodes), 
                    mapTargetToNode(curr, nodes)
                ]),
                map(([prevNode, currNode]) => assignNodeType(prevNode, currNode)),
                takeUntil(onMouseUp$)
            )
        ))
    .subscribe();

    const destroy = () => {
        interaction$.unsubscribe();
    }

    return { destroy };
}
