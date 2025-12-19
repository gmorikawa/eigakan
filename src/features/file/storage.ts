import type { Path } from "@features/file/entity.js";

export interface Storage {
    write(path: Path, data: Buffer): Promise<void>;
    read(path: Path): Promise<Buffer>;
}