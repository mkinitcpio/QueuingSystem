export class Task {
    private id: string;

    constructor(id: string) {
        this.id = id;
    }

    public getID(): string {
        return this.id;
    }
}
