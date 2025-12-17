export interface Repository<Id, Entity, PartialEntity> {
    findAll(): Promise<Entity[]>;
    findById(id: Id): Promise<Entity | null>;
    create(user: PartialEntity): Promise<Entity>;
    update(id: Id, user: Entity): Promise<Entity | null>;
    delete(id: Id): Promise<boolean>;
}