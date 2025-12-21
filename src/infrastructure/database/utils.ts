export function SQL(...commands: string[]): string {
    return commands.join(" ");
}