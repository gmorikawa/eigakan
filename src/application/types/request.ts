import express from "express";

import type { LoggedUser } from "@features/user/entity.js";

export interface Request<T extends Object = any> extends express.Request<T> {
    user?: LoggedUser;
}