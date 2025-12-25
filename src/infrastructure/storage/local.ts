import fs from "fs";
import type { Readable } from "stream";

import type { Path } from "@features/file/entity.js";
import type { Storage, StorageReadOptions } from "@features/file/storage.js";

export class LocalStorage implements Storage {
    public readonly basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    public async read(path: Path, options?: StorageReadOptions): Promise<Readable> {
        const fullPath = this.basePath
            .concat(path.startsWith("/") ? path : `/${path}`);

        if (options) {
            return fs.createReadStream(fullPath, { start: options.rangeStart, end: options.rangeEnd });
        } else {
            return fs.createReadStream(fullPath);
        }
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

    public async getBytes(path: Path): Promise<number> {
        const fullPath = this.basePath
            .concat(path.startsWith("/") ? path : `/${path}`);

        const stats = await fs.promises.stat(fullPath);
        return stats.size;
    }
}