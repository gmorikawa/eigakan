import type { Path } from "@features/file/entity.js";
import type { Storage } from "@features/file/storage.js";

export class LocalStorage implements Storage {
    public async read(path: Path): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }

    public async write(path: Path, data: Buffer): Promise<void> {
        throw new Error("Method not implemented.");
    }
}