type NodeProps = {
    isStartNode?: boolean;
    isDestinationNode?: boolean;
    position: {
        row: number;
        column: number;
    }
    grid: HTMLDivElement;
}

export class Node {
    private _isDestinationNode: boolean = false;
    private _isStartNode: boolean = false;
    private _isWallNode: boolean = false;
    private _element: HTMLDivElement;
    private _position: { row: number; column: number };
    private _distance: number = Infinity;
    private _isVisited: boolean = false;
    private _previousNode: Node | null = null;

    constructor({
        position,
        isDestinationNode,
        isStartNode,
        grid,
    }: NodeProps) {
        this._position = position;
        this._isDestinationNode = isDestinationNode ?? false;
        this._isStartNode = isStartNode ?? false;

        this._element = document.createElement('div');

        this._element.classList.add('node');

        this._element.dataset['row'] = position.row.toString();
        this._element.dataset['column'] = position.column.toString();

        if (this._isStartNode) {
            this.setStartNode();
        }

        if (this._isDestinationNode) {
            this.setDestinationNode();
        }

        grid.appendChild(this._element);
    }

    public get position() {
        return this._position;
    }

    public get element() {
        return this._element;
    }

    public setPreviousNode = (node: Node) => {
        this._previousNode = node;
    }

    public get previousNode() {
        return this._previousNode;
    }

    public setDistance = (distance: number) => {
        this._distance = distance;
    }

    public get isVisited() {
        return this._isVisited;
    }

    public setVisited = (value: boolean) => {
        this._isVisited = value;
    }

    public animateVisiting = () => {
        this._element.classList.add('visiting');
    }

    public animateShortest = () => {
        this._element.classList.add('shortest');
    }

    public get distance() {
        return this._distance;
    }

    public setWallNode = () => {
        this._isWallNode = true;
        this._element.classList.add('wallNode');
    }

    public setNormalNode = () => {
        this.removeDestinationNode();
        this.removeStartNode();
        this.removeWallNode();
    }

    public removeWallNode = () => {
        this._isWallNode = false;
        this._element.classList.remove('wallNode');
    }

    public setStartNode = () => {
        this._isStartNode = true;
        this._element.classList.add('startNode');
    }

    public setDestinationNode = () => {
        this._element.classList.add('destinationNode');
        this._isDestinationNode = true;
    }

    public removeStartNode = () => {
        this._isStartNode = false;
        this._element.classList.remove('startNode');
    }

    public removeDestinationNode = () => {
        this._isDestinationNode = false;
        this._element.classList.remove('destinationNode');
    }

    public get isDestinationNode() {
        return this._isDestinationNode;
    }

    public get isStartNode() {
        return this._isStartNode;
    }

    public get isWallNode() {
        return this._isWallNode;
    }

    public get isSpecialNode() {
        return this.isStartNode || this.isDestinationNode;
    }
}