import { AuthController } from "@application/controllers/auth-controller.js";
import { UserController } from "@application/controllers/user-controller.js";
import { Application } from "@application/index.js";

import type { Server } from "@application/index.js";

function buildAuthRoutes(app: Server) {
    const controller = new AuthController(Application.database);

    app.post("/api/auth/first-access", controller.firstAccess.bind(controller));
    app.post("/api/auth/login", controller.login.bind(controller));
}

function buildUserRoutes(app: Server) {
    const controller = new UserController(Application.database);

    app.get("/api/users", controller.getAll.bind(controller));
    app.get("/api/users/:id", controller.getById.bind(controller));
    app.post("/api/users", controller.create.bind(controller));
    app.put("/api/users/:id", controller.update.bind(controller));
    app.delete("/api/users/:id", controller.delete.bind(controller));
}

export async function initRoutes(app: Server) {
    buildAuthRoutes(app);
    buildUserRoutes(app);
}
