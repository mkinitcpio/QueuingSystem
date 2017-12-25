import { BaseFactory } from './base-factory';

export class NormalDistributionFunctionFactory extends BaseFactory {
    get(lambda: number): Function {
        let rnd = Math.random();
        return () => (1 / lambda) + (Math.sqrt(2.0 / lambda) / (2.0 * Math.sqrt(3))) * Math.abs(Math.cos(2.0 * Math.PI * rnd)) * Math.sqrt(2.0 * Math.log(1.0 / rnd));
    }
}