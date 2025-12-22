export interface Repository<Id, Entity, PartialEntity> {
    findAll(): Promise<Entity[]>;
    findById(id: Id): Promise<Entity | null>;
    create(entity: PartialEntity): Promise<Entity>;
    update(id: Id, entity: Entity): Promise<Entity | null>;
    delete(id: Id): Promise<boolean>;
}