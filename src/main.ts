import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Server } from '@/shared/types/server.js';

import { UserController } from './application/rest/controllers/user-controller.js';

class FastifyServer implements Server {
    private configureRoutes(app: ReturnType<typeof Fastify>): void {
        app.get('/users', async function (request: FastifyRequest, response: FastifyReply) {
            const controller = new UserController();
            const users = await controller.getAll();
            response.send(JSON.stringify(users));
        });
    }

    async run(): Promise<void> {
        const app = Fastify({
            logger: true
        });

        this.configureRoutes(app);

        app.listen({ port: 3020 }, function (err, address) {
            if (err) {
                app.log.error(err);
                process.exit(1);
            }
        });
    }
}

const server = new FastifyServer();
server.run();