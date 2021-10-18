type NodeProps = {
    isStartNode?: boolean;
    isDestinationNode?: boolean;
    position: {
        row: number;
        column: number;
    }
    grid: HTMLDivElement;
    onMouseDown: (node: Node) => void;
    onMouseEnter: (node: Node) => void;
    onMouseUp: () => void;
    onMouseLeave: (node: Node) => void;
}

export class Node {
    private _isDestinationNode: boolean = false;
    private _isStartNode: boolean = false;
    private _isWallNode: boolean = false;
    private _element: HTMLDivElement;
    private _wrapper: HTMLDivElement;
    private _position: { row: number; column: number };
    private _distance: number = Infinity;
    private _isVisited: boolean = false;
    private _previousNode: Node | null = null;

    constructor({
        position,
        isDestinationNode,
        isStartNode,
        grid,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
        onMouseLeave,
    }: NodeProps) {
        this._position = position;
        this._isDestinationNode = isDestinationNode ?? false;
        this._isStartNode = isStartNode ?? false;

        this._wrapper = document.createElement('div');
        this._element = document.createElement('div');

        this._element.classList.add('node');
        this._wrapper.classList.add('wrapperNode');

        if (this._isStartNode) {
            this.setStartNode();
        }

        if (this._isDestinationNode) {
            this.setDestinationNode();
        }

        this._wrapper.addEventListener('mousedown', (e) => {
            e.preventDefault();
            onMouseDown(this);
        });
        
        this._wrapper.addEventListener('mouseenter', () => onMouseEnter(this));
        this._wrapper.addEventListener('mouseup', () => onMouseUp());
        this._wrapper.addEventListener('mouseleave', () => onMouseLeave(this));

        this._wrapper.appendChild(this._element);
        grid.appendChild(this._wrapper);
    }

    public get position() {
        return this._position;
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
        this._element.classList.add('short');
    }

    public get distance() {
        return this._distance;
    }

    public setWallNode = () => {
        this._isWallNode = true;
        this._element.classList.add('wallNode');
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