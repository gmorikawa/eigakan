import { UserController } from "@application/controllers/user-controller.js";
import { Application } from "@application/index.js";

import type { Server } from "@application/index.js";

function buildUserRoutes(app: Server) {
    const controller = new UserController(Application.database);

    app.get("/api/users", controller.getAll.bind(controller));
    app.get("/api/users/:id", controller.getById.bind(controller));
    app.post("/api/users", controller.create.bind(controller));
    app.put("/api/users/:id", controller.update.bind(controller));
    app.delete("/api/users/:id", controller.delete.bind(controller));
}

export async function initRoutes(app: Server) {
    buildUserRoutes(app);
}
