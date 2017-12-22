import { BaseFactory } from './base-factory';

export class NormalDistributionFunctionFactory extends BaseFactory {
    get(lambda: number): Function {
        return () => (1 / lambda) + (Math.sqrt(2.0 / lambda) / (2.0 * Math.sqrt(3))) * Math.cos(2.0 * Math.PI * Math.random()) * Math.sqrt(2.0 * Math.log(1.0 / Math.random())) * 10;
    }
}