export class EntityNotFoundError extends Error {
    constructor(entity: string, id: string) {
        const message = `${entity} with ID ${id} not found.`;
        super(message);

        this.name = "EntityNotFoundError";
    }
}