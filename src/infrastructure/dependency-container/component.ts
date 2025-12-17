import { DependencyManager } from "./manager.js";

export interface ComponentConfiguration {
    name: string;
    dependencies?: string[];
}

export function Component(configuration: ComponentConfiguration) {
    return function (blueprint: any, context: ClassDecoratorContext) {
        DependencyManager.register(configuration, blueprint);
    };
}