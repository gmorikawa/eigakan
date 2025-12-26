export abstract class BusinessError extends Error {
    private status: number = 500;

    public get statusCode(): number {
        return this.status;
    }

    constructor(message: string, status: number = 500) {
        super(message);
        this.name = "BusinessError";
        this.status = status;
    }
}

export class EntityNotFoundError extends BusinessError {
    constructor(entity: string, id: string) {
        const message = `${entity} with ID ${id} not found.`;
        super(message, 404);

        this.name = "EntityNotFoundError";
    }
}