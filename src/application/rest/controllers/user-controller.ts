export class UserController {
    async getAll() {
        return { message: 'List of users' };
    }

    async getById(id: string) {
        return `getById: ${id}`;
    }

    async create(data: any) {
        return `create: ${JSON.stringify(data)}`;
    }

    async update(id: string, data: any) {
        return `update: ${id}, ${JSON.stringify(data)}`;
    }

    async delete(id: string) {
        return `delete: ${id}`;
    }
}

export default UserController;