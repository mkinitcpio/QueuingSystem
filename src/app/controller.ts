export class Controller {
    private static state: boolean = false;

    public static setState() {
        this.state = !this.state;
    }

    public static getState() {
        return this.state;
    }
}