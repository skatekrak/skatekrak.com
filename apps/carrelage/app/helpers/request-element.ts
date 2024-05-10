export default class RequestElement {
    private internalObj: any;

    private internalParent?: RequestElement;

    /**
     * Create new RequestElement
     */
    constructor(el: any) {
        this.internalObj = el;
        this.internalParent = null;
    }

    /**
     * Set parent
     */
    public setParent(parent: RequestElement): void {
        this.internalParent = parent;
    }

    /**
     * Get parent
     */
    public parent(): RequestElement {
        return this.internalParent;
    }

    /**
     * Get the element itself
     */
    public el(): any {
        return this.internalObj;
    }
}
