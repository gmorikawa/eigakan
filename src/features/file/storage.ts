import type { Readable } from "stream";
import type { Path } from "@features/file/entity.js";

export type StorageReadOptions = { rangeStart: number; rangeEnd: number };

export interface Storage {
    read(path: Path, options?: StorageReadOptions): Promise<Readable>;
    write(path: Path, stream: Readable): Promise<void>;

    getBytes(path: Path): Promise<number>;
}