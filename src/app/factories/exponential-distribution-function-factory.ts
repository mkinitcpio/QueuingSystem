import { BaseFactory } from './base-factory';

export class ExponentialDistributionFunctionFactory extends BaseFactory {
    get(intensity: number): Function {
        return () => (-1.0) / intensity * Math.log(Math.random());
    }
}