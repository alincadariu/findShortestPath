type NodeProps = {
    isStartNode?: boolean;
    isDestinationNode?: boolean;
    position: {
        row: number;
        column: number;
    }
    grid: HTMLDivElement;
    onMouseDown: (e: NodeElement) => void;
    onMouseEnter: (e: NodeElement) => void;
    onMouseUp: (e: NodeElement) => void;
    onMouseLeave: (e: NodeElement) => void;
}

export class NodeElement {
    private _isDestinationNode: boolean = false;
    private _isStartNode: boolean = false;
    private _isWallNode: boolean = false;
    private _element: HTMLDivElement;
    private _position: { row: number; column: number };

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

        this._element = document.createElement('div');

        this._element.classList.add('node');

        if (this._isStartNode) {
            this.setStartNode();
        }

        if (this._isDestinationNode) {
            this.setDestinationNode();
        }

        this._element.addEventListener('mousedown', () => onMouseDown(this));
        this._element.addEventListener('mouseenter', () => onMouseEnter(this));
        this._element.addEventListener('mouseup', () => onMouseUp(this));
        this._element.addEventListener('mouseleave', () => onMouseLeave(this));

        grid.appendChild(this._element);
    }

    public get position() {
        return this._position;
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