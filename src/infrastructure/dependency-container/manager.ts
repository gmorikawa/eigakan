import type { ComponentConfiguration } from "./component.js";

interface Blueprint<T> {
    new(...args: any[]): T;
}

export interface Dependency<T = any> {
    name: string;
    blueprint: Blueprint<T>;
    dependencies: string[];
    instance?: T;
}

export class DependencyManager {
    private static container: Map<string, Dependency> = new Map();

    public static register<T>(component: ComponentConfiguration, blueprint: Blueprint<T>) {
        this.container.set(component.name, {
            name: component.name,
            blueprint: blueprint,
            dependencies: component?.dependencies || []
        });
    }

    public static resolve<T>(name: string): T {
        const dependency = this.container.get(name);

        if (!dependency) {
            throw new Error(`Dependency "${name}" not found in container.`);
        }

        if (!dependency.instance) {
            const dependenciesInstances = dependency.dependencies.map(depName => this.resolve<any>(depName));
            dependency.instance = new dependency.blueprint(...dependenciesInstances);
        }

        return dependency.instance as T;
    }

    public static use<T>(name: string, blueprint: Blueprint<T>, instance: T) {
        const dependency = {
            name: name,
            blueprint: blueprint,
            dependencies: [],
            instance: instance
        };

        this.container.set(name, dependency);
    }
}