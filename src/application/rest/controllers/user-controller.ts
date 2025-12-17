import type { UserService } from "@features/user/service.js";

export class UserController {

    constructor(
        private service: UserService
    ) { }

    public async getAll() {
        return this.service.getAll();
    }

    public async getById(id: string) {
        return this.service.getById(id);
    }

    public async create(data: any) {
        return this.service.create(data);
    }

    public async update(id: string, data: any) {
        return this.service.update(id, data);
    }

    public async delete(id: string) {
        return this.service.delete(id);
    }
}

export default UserController;