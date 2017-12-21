export class Task {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    getID(): string {
        return this.id;
    }
}
