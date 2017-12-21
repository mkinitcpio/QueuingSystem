export abstract class BaseFactory {
    abstract get(intensity: number): Function;
}