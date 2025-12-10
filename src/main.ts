import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';

const fastify = Fastify({
    logger: true
});

fastify.get('/', function (request: FastifyRequest, response: FastifyReply) {
    response.send({ hello: 'world' });
});

fastify.listen({ port: 3020 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});