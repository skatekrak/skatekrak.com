import { NextFunction, Request, Response } from 'express';
import RequestElement from './request-element';

export default class RequestObject {
    private internalList: RequestElement[];

    constructor() {
        this.internalList = [];
    }

    /**
     * Add Object to the list
     */
    public push(el: any): void {
        const element = new RequestElement(el);
        const parent = this.last();
        element.setParent(parent);
        this.internalList.push(element);
    }

    /**
     * Get the full list of Objects
     */
    public list(): RequestElement[] {
        return this.internalList;
    }

    /**
     *
     */
    public elementsList(): any[] {
        const list = this.internalList.map((el) => {
            const obj = el.el().toJSON();
            delete obj.likes;
            delete obj.comments;
            delete obj.addedBy;
            delete obj.spot;
            delete obj.createdAt;
            delete obj.updatedAt;
            delete obj.hashtags;
            return obj;
        });
        return list;
    }

    /**
     * Get the first Object of the list
     */
    public first(): RequestElement {
        return this.internalList[0];
    }

    /**
     * Get the last element of the list
     */
    public last(): RequestElement {
        return this.internalList[this.internalList.length - 1];
    }
}

/**
 * Load middleware
 * @returns {Function}
 */
function requestObject(req: Request, _RES: Response, next: NextFunction) {
    req.object = new RequestObject();
    next();
}

export { requestObject };
