import type { UserRepository } from "@features/user/repository.js";

export class UserService {
    constructor(
        private repository: UserRepository
    ) { }

    public async getAll() {
        return this.repository.getAll();
    }

    public async getById(id: string) {
        return this.repository.getById(id);
    }

    public async create(data: any) {
        return this.repository.create(data);
    }

    public async update(id: string, data: any) {
        return this.repository.update(id, data);
    }

    public async delete(id: string) {
        return this.repository.delete(id);
    }
}