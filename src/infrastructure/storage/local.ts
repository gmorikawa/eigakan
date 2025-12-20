import fs from "fs";
import type { Readable } from "stream";

import type { Path } from "@features/file/entity.js";
import type { Storage } from "@features/file/storage.js";

export class LocalStorage implements Storage {
    public readonly basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    public async read(path: Path): Promise<Readable> {
        const fullPath = this.basePath
            .concat(path.startsWith("/") ? path : `/${path}`);

        return fs.createReadStream(fullPath);
    }

    public async write(path: Path, stream: Readable): Promise<void> {
        const fullPath = this.basePath
            .concat(path.startsWith("/") ? path : `/${path}`);

        fs.mkdir(fullPath.substring(0, fullPath.lastIndexOf("/")), { recursive: true} , (err) => {
            if (err) {
                throw err;
            }
        });
        stream.pipe(fs.createWriteStream(fullPath));
    }
}