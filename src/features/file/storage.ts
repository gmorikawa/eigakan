import type { Readable } from "stream";
import type { Path } from "@features/file/entity.js";

export interface Storage {
    read(path: Path): Promise<Readable>;
    write(path: Path, stream: Readable): Promise<void>;
}