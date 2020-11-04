export class News {
    _id: string;
    creationDate: Date;
    lastEditDate: Date;
    name: string;
    imagePath: string;
    content: string;

    constructor(data?){
        data = data || {};
        this._id = data._id || '';
        this.creationDate = data.creationDate ? new Date(data.creationDate) : null;
        this.lastEditDate = data.lastEditDate ? new Date(data.lastEditDate) : null;
        this.name = data.name || '';
        this.imagePath = data.imagePath || '';
        this.content = data.content || '';
    }
}