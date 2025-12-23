import { AuthController } from "@application/controllers/auth.js";
import { FileController } from "@application/controllers/file.js";
import { LanguageController } from "@application/controllers/language.js";
import { UserController } from "@application/controllers/user.js";
import { VideoController } from "@application/controllers/video.js";
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

function buildFileRoutes(app: Server) {
    const controller = new FileController(Application.database);

    app.post("/api/files/:id/upload", controller.upload.bind(controller));
    app.get("/api/files/:id/download", controller.download.bind(controller));
}

function buildLanguageRoutes(app: Server) {
    const controller = new LanguageController(Application.database);

    app.get("/api/languages", controller.getAll.bind(controller));
    app.get("/api/languages/:id", controller.getById.bind(controller));
    app.get("/api/languages/code/:code", controller.getByCode.bind(controller));
    app.post("/api/languages", controller.create.bind(controller));
    app.put("/api/languages/:id", controller.update.bind(controller));
    app.delete("/api/languages/:id", controller.delete.bind(controller));
}

function buildVideoRoutes(app: Server) {
    const controller = new VideoController(Application.database)

    app.get("/api/videos", controller.getAll.bind(controller));
    app.get("/api/videos/:id", controller.getById.bind(controller));
    app.post("/api/videos", controller.create.bind(controller));
    app.put("/api/videos/:id", controller.update.bind(controller));
    app.delete("/api/videos/:id", controller.delete.bind(controller));
    app.post("/api/videos/:id/upload", controller.upload.bind(controller));
    app.get("/api/videos/:id/download", controller.download.bind(controller));
}

export async function initRoutes(app: Server) {
    buildAuthRoutes(app);
    buildUserRoutes(app);
    buildFileRoutes(app);
    buildLanguageRoutes(app);
    buildVideoRoutes(app);
}
