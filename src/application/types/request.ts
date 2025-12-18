import express from "express";

export type Request<T extends Object = any> = express.Request<T>;